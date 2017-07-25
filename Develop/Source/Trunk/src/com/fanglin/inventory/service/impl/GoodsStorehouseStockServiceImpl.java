/**
 * @File Name		: GoodsStorehouseStockServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.CheckListDao;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.dao.GoodsStorehouseStockDao;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.po.CheckListPO;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.vo.CheckListVO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsStorehouseStockVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("goodsStorehouseStockService")
@Transactional(readOnly=true)
public class GoodsStorehouseStockServiceImpl implements GoodsStorehouseStockService {
	
	@Autowired
	private GoodsStorehouseStockDao goodsStorehouseStockDao;
	
	@Autowired
	private GoodsDao goodsDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private StorehouseDao storehouseDao;
	
	@Autowired
	private CheckListDao checkListDao;
	
	
	@Override
	public void pageGoodsStorehouseStock(Paging paging, List<Filter> filters) {
		
		List<GoodsStorehouseStockPO> goodsStorehouseStockPOs = goodsStorehouseStockDao.pageGoodsStorehouseStock(paging, filters);
		List<GoodsStorehouseStockVO> goodsStorehouseStockVOs = new ArrayList<GoodsStorehouseStockVO>();
		
		GoodsStorehouseStockVO goodsStorehouseStockVO;
		
		for(GoodsStorehouseStockPO goodsStorehouseStockPO: goodsStorehouseStockPOs){
			
			goodsStorehouseStockVO = new GoodsStorehouseStockVO(new GoodsVO(),new ColorVO(),new FormatVO(), new StorehouseVO());
			
			goodsStorehouseStockVO.setGshsId(goodsStorehouseStockVO.getGshsId());
			goodsStorehouseStockVO.setNum(goodsStorehouseStockPO.getNum());
			
			BeanUtil.copyProperties(goodsStorehouseStockPO.getGoods(), goodsStorehouseStockVO.getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(goodsStorehouseStockPO.getColor(), goodsStorehouseStockVO.getColor());
			BeanUtil.copyProperties(goodsStorehouseStockPO.getFormat(), goodsStorehouseStockVO.getFormat());
			BeanUtil.copyProperties(goodsStorehouseStockPO.getStorehouse(), goodsStorehouseStockVO.getStorehouse());
			
			goodsStorehouseStockVOs.add(goodsStorehouseStockVO);
		}

		paging.setData(goodsStorehouseStockVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void checkGoodsStorehouseStock(CheckListVO checkListVO, String userId) throws FLException {
		
		// type 0: 盘盈 , 1: 盘亏
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(checkListVO.getGoods().getGid(), checkListVO.getColor().getCid(), checkListVO.getFormat().getFid(), checkListVO.getStorehouse().getShId());
		
		if(goodsStorehouseStockPO == null){
			throw new FLException(260011, "商品库存信息不存在");
		}
		
		short type = checkListVO.getType();
		float num = checkListVO.getNum();
		
		//实时更新盘点状态
		CheckListPO checkListPO = new CheckListPO();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		checkListPO.setType(type);
		checkListPO.setNum(num);
		checkListPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		checkListPO.setGoods(goodsStorehouseStockPO.getGoods());
		checkListPO.setColor(goodsStorehouseStockPO.getColor());
		checkListPO.setFormat(goodsStorehouseStockPO.getFormat());
		checkListPO.setStorehouse(goodsStorehouseStockPO.getStorehouse());
		checkListPO.setCreateUser(userPO);
		
		checkListDao.save(checkListPO);

		if(type == 0){
			goodsStorehouseStockPO.setNum(Arith.add(goodsStorehouseStockPO.getNum(), num));
		}else if(type == 1){
			goodsStorehouseStockPO.setNum(Arith.sub(goodsStorehouseStockPO.getNum(), num));
		}
		
		goodsStorehouseStockDao.update(goodsStorehouseStockPO);
	}
	
	@Override
	public GoodsStorehouseStockVO queryStorehouseStockByShIdAGId(GoodsStorehouseStockVO goodsStorehouseStockVO){
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), goodsStorehouseStockVO.getStorehouse().getShId());
		
		goodsStorehouseStockVO = new GoodsStorehouseStockVO();
		
		BeanUtil.copyProperties(goodsStorehouseStockPO, goodsStorehouseStockVO, Arrays.asList("goods","color","format","storehouse"));
		
		return goodsStorehouseStockVO;
	}
	
	@Override
	public Float queryGoodsStorehouseStockByGid(GoodsStorehouseStockVO goodsStorehouseStockVO) {
			
		Float nums = goodsStorehouseStockDao.queryGoodsStorehouseStockByGid(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid());
		
		return nums;
	}

	public StorehousePO instorehouse(long gid,long cid,long fid, long shId, float num) throws FLException{
		
		if(goodsDao.get(gid) == null){
			throw new FLException(260004, "商品不存在");
		}
		
		if(storehouseDao.get(shId) == null){
			throw new FLException(260005, "仓库不存在");
		}
		
		GoodsStorehouseStockPO inGoodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(gid, cid, fid , shId);
		
		if(inGoodsStorehouseStockPO == null){
			inGoodsStorehouseStockPO = new GoodsStorehouseStockPO();
			
			inGoodsStorehouseStockPO.setGoods(new GoodsPO(gid));
			inGoodsStorehouseStockPO.setColor(new ColorPO(cid));
			inGoodsStorehouseStockPO.setFormat(new FormatPO(fid));
			inGoodsStorehouseStockPO.setStorehouse(new StorehousePO(shId));
			
			inGoodsStorehouseStockPO.setNum(0f);
		}
		
		inGoodsStorehouseStockPO.setNum(Arith.add(inGoodsStorehouseStockPO.getNum(), num));
		
		goodsStorehouseStockDao.saveOrUpdate(inGoodsStorehouseStockPO);
		
		return inGoodsStorehouseStockPO.getStorehouse();
	}
	
	public StorehousePO outstorehouse(long gid, long cid, long fid, long shId,
			float num) throws FLException{
		
		if(goodsDao.get(gid) == null){
			throw new FLException(260004, "商品不存在");
		}
		
		if(storehouseDao.get(shId) == null){
			throw new FLException(260005, "仓库不存在");
		}
	
		GoodsStorehouseStockPO outGoodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(gid, cid, fid, shId);
		
		if(outGoodsStorehouseStockPO == null){
			throw new FLException(260008, "商品库存不足");
		}
		
		if(outGoodsStorehouseStockPO.getNum() < num){
			throw new FLException(260008, "商品库存不足");
		}
		
		outGoodsStorehouseStockPO.setNum(Arith.sub(outGoodsStorehouseStockPO.getNum(), num));
		
		goodsStorehouseStockDao.update(outGoodsStorehouseStockPO);
		
		return outGoodsStorehouseStockPO.getStorehouse();
	}

}

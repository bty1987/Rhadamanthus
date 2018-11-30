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
import com.fanglin.inventory.dao.GoodsPackageDao;
import com.fanglin.inventory.dao.GoodsStorehouseStockDao;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.dao.StorehouseUserDao;
import com.fanglin.inventory.po.CheckListPO;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.GoodsPackagePO;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.po.StorehouseUserPO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.ManifestService;
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
	private StorehouseUserDao storehouseUserDao;
	
	@Autowired
	private CheckListDao checkListDao;
	
	@Autowired
	private GoodsPackageDao goodsPackageDao;
	
	@Autowired
	private ManifestService manifestService;
	
	@Override
	public void pageGoodsStorehouseStock(Paging paging, List<Filter> filters, String userId) {
		
		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUserId(userId);
		List<Long> shids = new ArrayList<Long>();
		List<GoodsStorehouseStockVO> goodsStorehouseStockVOs = new ArrayList<GoodsStorehouseStockVO>();
		
		if(storehouseUserPOs.size() != 0){
			
			for (StorehouseUserPO storehouseUserPO : storehouseUserPOs) {
				
				long shid = storehouseUserPO.getStorehouse().getShId();
				
				shids.add(shid);
			}
			
			List<GoodsStorehouseStockPO> goodsStorehouseStockPOs = goodsStorehouseStockDao.pageGoodsStorehouseStock(paging, filters, shids);
		
			GoodsStorehouseStockVO goodsStorehouseStockVO;
		
			for(GoodsStorehouseStockPO goodsStorehouseStockPO: goodsStorehouseStockPOs){
				
				goodsStorehouseStockVO = new GoodsStorehouseStockVO(new GoodsVO(),new ColorVO(),new FormatVO(), new StorehouseVO());
				
				goodsStorehouseStockVO.setGshsId(goodsStorehouseStockVO.getGshsId());
				goodsStorehouseStockVO.setNum(goodsStorehouseStockPO.getNum());
				
				BeanUtil.copyProperties(goodsStorehouseStockPO.getGoods(), goodsStorehouseStockVO.getGoods(),Arrays.asList("accessoriesType"));
				BeanUtil.copyProperties(goodsStorehouseStockPO.getColor(), goodsStorehouseStockVO.getColor());
				BeanUtil.copyProperties(goodsStorehouseStockPO.getFormat(), goodsStorehouseStockVO.getFormat());
				BeanUtil.copyProperties(goodsStorehouseStockPO.getStorehouse(), goodsStorehouseStockVO.getStorehouse());
				
				goodsStorehouseStockVOs.add(goodsStorehouseStockVO);
			}
			
		}

		paging.setData(goodsStorehouseStockVOs);
	}
	
	@Override
	public Float queryGoodsStorehouseStockByGid(GoodsStorehouseStockVO goodsStorehouseStockVO) {
			
		Float nums = goodsStorehouseStockDao.queryGoodsStorehouseStockByGid(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid());
		
		return nums;
	}
	
	@Override
	public GoodsStorehouseStockVO queryStorehouseStockByShIdAGId(GoodsStorehouseStockVO goodsStorehouseStockVO){
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), goodsStorehouseStockVO.getStorehouse().getShId());
		
		goodsStorehouseStockVO = new GoodsStorehouseStockVO();
		
		BeanUtil.copyProperties(goodsStorehouseStockPO, goodsStorehouseStockVO, Arrays.asList("goods","color","format","storehouse"));
		
		return goodsStorehouseStockVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int makeGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStockVO)throws FLException {
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(goodsStorehouseStockVO.getGoods().getGid(), goodsStorehouseStockVO.getColor().getCid(), goodsStorehouseStockVO.getFormat().getFid(), goodsStorehouseStockVO.getStorehouse().getShId());
		
		if(goodsStorehouseStockPO != null){
			
			throw new FLException(260042,"商品库存已存在");
			
		}
		
		goodsStorehouseStockPO = new GoodsStorehouseStockPO(new GoodsPO(),new ColorPO(),new FormatPO(),new StorehousePO());
		
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getGoods(), goodsStorehouseStockPO.getGoods());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getColor(), goodsStorehouseStockPO.getColor());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getFormat(), goodsStorehouseStockPO.getFormat());
		BeanUtil.copyPropertie(goodsStorehouseStockVO.getStorehouse(), goodsStorehouseStockPO.getStorehouse());
		
		goodsStorehouseStockPO.setNum(0f);
		
		goodsStorehouseStockDao.save(goodsStorehouseStockPO);
		
		return 0;
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
	@Transactional(rollbackFor=Exception.class)
	public int mergePackage(GoodsStorehouseStockVO goodsStorehouseStockVO,String userId,int company)throws FLException {
		
		List<ManifestItemPO> manifestItemPOs = new ArrayList<ManifestItemPO>();
		
		ManifestItemPO manifestItemPO = new ManifestItemPO();
		
		GoodsPO goodsPO = goodsDao.get(goodsStorehouseStockVO.getGoods().getGid());
		
		if(goodsPO.getType()!=GoodsPO.TYPE_SUIT_INT){
			throw new FLException(260041, "套餐不存在");
		}
		
		long gid = goodsStorehouseStockVO.getGoods().getGid();
		long cid = goodsStorehouseStockVO.getColor().getCid();
		long fid = goodsStorehouseStockVO.getFormat().getFid();
		long shId = goodsStorehouseStockVO.getStorehouse().getShId();
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(gid,cid,fid,shId);
		
		float num = Arith.add(goodsStorehouseStockPO.getNum(), goodsStorehouseStockVO.getNum());
		
		goodsStorehouseStockPO.setNum(num);
		
		goodsStorehouseStockDao.update(goodsStorehouseStockPO);
		
		manifestItemPO.setGoods(goodsStorehouseStockPO.getGoods());
		manifestItemPO.setColor(goodsStorehouseStockPO.getColor());
		manifestItemPO.setFormat(goodsStorehouseStockPO.getFormat());
		manifestItemPO.setInstorehouse(goodsStorehouseStockPO.getStorehouse());
		manifestItemPO.setNum(goodsStorehouseStockVO.getNum());
		
		manifestItemPOs.add(manifestItemPO);
		
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsStorehouseStockVO.getGoods().getGid());
		
		for(GoodsPackagePO goodsPackagePO : goodsPackagePOs){
			
			manifestItemPO = new ManifestItemPO();
			
			long _gid = goodsPackagePO.getGoods().getGid();
			long _cid = goodsPackagePO.getColor().getCid();
			long _fid = goodsPackagePO.getFormat().getFid();
			
			GoodsStorehouseStockPO goodsStorehouseStock = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(_gid,_cid,_fid,shId);
			
			float _num = Arith.mul(goodsPackagePO.getNum(), goodsStorehouseStockVO.getNum());
			
			if(goodsStorehouseStock==null){
				
				throw new FLException(260008, "商品库存不足");
				
			}
				
			if(goodsStorehouseStock.getNum() < _num ){
				
				throw new FLException(260008, "商品库存不足");
				
			}
						
			float _storehousestockNum = Arith.sub(goodsStorehouseStock.getNum(), _num);
			
			goodsStorehouseStock.setNum(_storehousestockNum);
			
			goodsStorehouseStockDao.update(goodsStorehouseStock);
			
			manifestItemPO.setGoods(goodsStorehouseStock.getGoods());
			manifestItemPO.setColor(goodsStorehouseStock.getColor());
			manifestItemPO.setFormat(goodsStorehouseStock.getFormat());
			manifestItemPO.setOutstorehouse(goodsStorehouseStockPO.getStorehouse());
			manifestItemPO.setNum(_num);
			
			manifestItemPOs.add(manifestItemPO);
				
		}
		
		manifestService.addManifestForPM(manifestItemPOs, userId, company);
		
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int splitPackage(GoodsStorehouseStockVO goodsStorehouseStockVO,String userId,int company)throws FLException {
		
		List<ManifestItemPO> manifestItemPOs = new ArrayList<ManifestItemPO>();
		
		ManifestItemPO manifestItemPO = new ManifestItemPO();
		
		GoodsPO goodsPO = goodsDao.get(goodsStorehouseStockVO.getGoods().getGid());
		
		if(goodsPO.getType()!=GoodsPO.TYPE_SUIT_INT){
			throw new FLException(260041, "套餐不存在");
		}
		
		long gid = goodsStorehouseStockVO.getGoods().getGid();
		long cid = goodsStorehouseStockVO.getColor().getCid();
		long fid = goodsStorehouseStockVO.getFormat().getFid();
		long shId = goodsStorehouseStockVO.getStorehouse().getShId();
		
		GoodsStorehouseStockPO goodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(gid,cid,fid,shId);
		
		if(goodsStorehouseStockPO == null){
			throw new FLException(260008, "商品库存不足");
		}
		
		if(goodsStorehouseStockPO.getNum()<goodsStorehouseStockVO.getNum()){
			throw new FLException(260008, "商品库存不足");
		}
		
		float num = Arith.sub(goodsStorehouseStockPO.getNum(), goodsStorehouseStockVO.getNum());//用前一个数减去后一个数
		
		if( num < 0 ){
			throw new FLException(260008, "商品库存不足");
		}
		
		goodsStorehouseStockPO.setNum(num);
		
		goodsStorehouseStockDao.update(goodsStorehouseStockPO);
		
		manifestItemPO.setGoods(goodsStorehouseStockPO.getGoods());
		manifestItemPO.setColor(goodsStorehouseStockPO.getColor());
		manifestItemPO.setFormat(goodsStorehouseStockPO.getFormat());
		manifestItemPO.setOutstorehouse(goodsStorehouseStockPO.getStorehouse());
		manifestItemPO.setNum(goodsStorehouseStockVO.getNum());
		
		manifestItemPOs.add(manifestItemPO);
		
		List<GoodsPackagePO> goodsPackagePOs = goodsPackageDao.queryPackage(goodsStorehouseStockVO.getGoods().getGid());
		
		for(GoodsPackagePO goodsPackagePO : goodsPackagePOs){
			
			manifestItemPO = new ManifestItemPO();
			
			long _gid = goodsPackagePO.getGoods().getGid();
			long _cid = goodsPackagePO.getColor().getCid();
			long _fid = goodsPackagePO.getFormat().getFid();
			
			GoodsStorehouseStockPO goodsStorehouseStock = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(_gid,_cid,_fid,shId);
			
			if(goodsStorehouseStock==null){
				
				goodsStorehouseStock = new GoodsStorehouseStockPO();
				
				float _packageNum = Arith.mul(goodsStorehouseStockVO.getNum(), goodsPackagePO.getNum());
				
				goodsStorehouseStock.setGoods(goodsPackagePO.getGoods());
				goodsStorehouseStock.setColor(goodsPackagePO.getColor());
				goodsStorehouseStock.setFormat(goodsPackagePO.getFormat());
				goodsStorehouseStock.setStorehouse(goodsStorehouseStockPO.getStorehouse());
				goodsStorehouseStock.setNum(_packageNum);
				
				goodsStorehouseStockDao.save(goodsStorehouseStock);
				
				manifestItemPO.setGoods(goodsPackagePO.getGoods());
				manifestItemPO.setColor(goodsPackagePO.getColor());
				manifestItemPO.setFormat(goodsPackagePO.getFormat());
				manifestItemPO.setInstorehouse(goodsStorehouseStockPO.getStorehouse());
				manifestItemPO.setNum(_packageNum);
				
				manifestItemPOs.add(manifestItemPO);
				
			}else{
				
				float _packageNum = Arith.mul(goodsStorehouseStockVO.getNum(), goodsPackagePO.getNum());
				
				float _num = Arith.add(goodsStorehouseStock.getNum(), _packageNum);
						
				goodsStorehouseStock.setNum(_num);
				
				goodsStorehouseStockDao.update(goodsStorehouseStock);
				
				manifestItemPO.setGoods(goodsStorehouseStock.getGoods());
				manifestItemPO.setColor(goodsStorehouseStock.getColor());
				manifestItemPO.setFormat(goodsStorehouseStock.getFormat());
				manifestItemPO.setInstorehouse(goodsStorehouseStockPO.getStorehouse());
				manifestItemPO.setNum(_packageNum);
				
				manifestItemPOs.add(manifestItemPO);
				
			}
			
		}
		
		manifestService.addManifestForPS(manifestItemPOs, userId, company);
		
		return 0;
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
	
	public StorehousePO outstorehouse(long gid, long cid, long fid, long shId, float num) throws FLException{
		
		GoodsStorehouseStockPO outGoodsStorehouseStockPO = goodsStorehouseStockDao.queryGoodsStorehouseStockByShIdAGId(gid, cid, fid, shId);

		if(outGoodsStorehouseStockPO == null){
			throw new FLException(260011, "商品库存不存在");
		}
		
		if(outGoodsStorehouseStockPO.getGoods() == null){
			throw new FLException(260004, "商品不存在");
		}
		
		if(outGoodsStorehouseStockPO.getStorehouse() == null){
			throw new FLException(260005, "仓库不存在");
		}
	
		if(outGoodsStorehouseStockPO.getNum() < num){
			throw new FLException(260008, outGoodsStorehouseStockPO.getGoods().getName() + "商品库存不足");
		}
		
		outGoodsStorehouseStockPO.setNum(Arith.sub(outGoodsStorehouseStockPO.getNum(), num));
		
		goodsStorehouseStockDao.update(outGoodsStorehouseStockPO);
		
		return outGoodsStorehouseStockPO.getStorehouse();
	}

}

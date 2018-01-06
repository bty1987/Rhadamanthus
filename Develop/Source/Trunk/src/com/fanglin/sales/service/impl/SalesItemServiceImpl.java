package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesItemService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;


@Service("salesItemService")
@Transactional(readOnly=true)
public class SalesItemServiceImpl implements SalesItemService {
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private SalesItemDao salesItemDao;
	
	@Autowired
	private GoodsDao goodsDao;
	
	@Override
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO) {
		
		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesVO.getSid());
		
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();
		
		for(SalesItemPO salesItemPO: salesItemPOs){
			
			SalesItemVO salesItemVO = new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO());
			
			BeanUtil.copyProperties(salesItemPO, salesItemVO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(),Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(salesItemPO.getColor(), salesItemVO.getColor());
			BeanUtil.copyProperties(salesItemPO.getFormat(), salesItemVO.getFormat());
			
			salesItemVOs.add(salesItemVO);
		}
 	
		return salesItemVOs;
	}
	
	@Override
	public List<SalesItemVO> querySalesItemBySids(List<Long> sids) {
		
		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySids(sids);
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();
		
		for(SalesItemPO salesItemPO : salesItemPOs){
			
			SalesItemVO salesItemVO = new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO());
			
			BeanUtil.copyProperties(salesItemPO, salesItemVO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(),Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(salesItemPO.getColor(), salesItemVO.getColor());
			BeanUtil.copyProperties(salesItemPO.getFormat(), salesItemVO.getFormat());
			
			salesItemVOs.add(salesItemVO);
		}
		
		return salesItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSalesItem(SalesVO salesVO, List<SalesItemVO> salesItemVOs)throws FLException {
		
		SalesPO salesPO = salesDao.get(salesVO.getSid());
		
		if(salesPO == null ){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		float total = salesPO.getTotal();
		float _total = 0f;
		
		for(SalesItemVO salesItemVO : salesItemVOs){
			
			GoodsPO goodsPO = goodsDao.get(salesItemVO.getGoods().getGid());
			
			if(!salesPO.getBrand().equals(goodsPO.getBrand())){
				throw new FLException(260036, "销售项品牌不同"); // 品牌不一致 没有错误code码
			}
			
			SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(), new ColorPO(), new FormatPO());
			
			BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(salesItemVO.getGoods(), salesItemPO.getGoods(),Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(salesItemVO.getColor(), salesItemPO.getColor());
			BeanUtil.copyProperties(salesItemVO.getFormat(), salesItemPO.getFormat());
			
			salesItemPO.setSid(salesVO.getSid());
			
			salesPO.setOtherStatus(salesVO.getOtherStatus());
			
			_total = Arith.add(_total, salesItemPO.getTotal());
			
			salesItemDao.save(salesItemPO);
			
		}
		
		if(_total!=salesVO.getTotal()){
			
			throw new FLException(150025, "款项金额不正确");
			
		}
		
		salesPO.setTotal(Arith.add(total, _total));
		
		salesDao.update(salesPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesItem(SalesItemVO salesItemVO)throws FLException {
		
		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());
		
		if(salesItemPO == null){
			throw new FLException(260023, "销售项不存在");
		}
		
		SalesPO salesPO = salesDao.get(salesItemPO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		if(salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		salesPO.setTotal(Arith.add(Arith.sub(salesPO.getTotal(), salesItemPO.getTotal()), salesItemVO.getTotal()));
		
		salesItemPO.setNum(salesItemVO.getNum());
		salesItemPO.setTotal(salesItemVO.getTotal());
		salesItemPO.setComment(salesItemVO.getComment());
		
		salesItemDao.update(salesItemPO);
		
		salesDao.update(salesPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesItemForBalance(SalesItemVO salesItemVO) throws FLException {
		
		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());
		
		if(salesItemPO == null){
			throw new FLException(260023, "销售项不存在");
		}
		
		salesItemPO.setCtype(salesItemVO.getCtype());
		salesItemPO.setCvalue(salesItemVO.getCvalue());
		
		salesItemDao.update(salesItemPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteSalesItem(SalesItemVO salesItemVO)throws FLException {
		
		SalesItemPO salesItemPO = salesItemDao.get(salesItemVO.getSiid());
		
		if(salesItemPO == null){
			throw new FLException(260023, "销售项不存在");
		}
		
		SalesPO salesPO = salesDao.get(salesItemPO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		if(salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setTotal(Arith.sub(salesPO.getTotal(), salesItemPO.getTotal()));
		
		salesDao.update(salesPO);
		
		salesItemDao.delete(salesItemPO);
		
		return 0;
	}

}

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.ColorDao;
import com.fanglin.inventory.dao.FormatDao;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.dao.SalesDao;
import com.fanglin.inventory.dao.SalesItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.SalesItemPO;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.service.SalesItemService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;
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
	
	@Autowired
	private ColorDao colorDao;
	
	@Autowired
	private FormatDao formatDao;

	@Override
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO) {
		
		List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesVO.getSid());
		
		List<SalesItemVO> salesItemVOs = new ArrayList<SalesItemVO>();
		
		for(SalesItemPO salesItemPO: salesItemPOs){
			
			SalesItemVO salesItemVO = new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO());
			
			BeanUtil.copyProperties(salesItemPO, salesItemVO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(),Arrays.asList("assisType"));
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
			BeanUtil.copyProperties(salesItemPO.getGoods(), salesItemVO.getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(salesItemPO.getColor(), salesItemVO.getColor());
			BeanUtil.copyProperties(salesItemPO.getFormat(), salesItemVO.getFormat());
			
			salesItemVOs.add(salesItemVO);
		}
		
		return salesItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSalesItem(SalesVO salesVO, SalesItemVO salesItemVO)throws FLException {
		
		
		
		SalesPO salesPO = salesDao.querySalesBySid(salesVO.getSid());
		SalesItemPO salesItemPO = new SalesItemPO(new GoodsPO(), new ColorPO(), new FormatPO());
		
		if(salesPO == null ){
			throw new FLException(260021, "销售单不存在");
		}
		
		float total = salesPO.getTotal();
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		BeanUtil.copyProperties(goodsDao.get(salesItemVO.getGoods().getGid()), salesItemVO.getGoods(),Arrays.asList("assisType"));
		
		if(!salesPO.getBrand().equals(salesItemVO.getGoods().getBrand())){
			throw new FLException(111, "品牌不一致");
		}
		
		
		BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods","color","format"));
		BeanUtil.copyProperties(salesItemVO.getGoods(), salesItemPO.getGoods(),Arrays.asList("assisType"));
		BeanUtil.copyProperties(colorDao.get(salesItemVO.getColor().getCid()), salesItemPO.getColor());
		BeanUtil.copyProperties(formatDao.get(salesItemVO.getFormat().getFid()), salesItemPO.getFormat());
		salesItemPO.setSid(salesVO.getSid());
		
		salesPO.setTotal(Arith.add(total, salesItemVO.getTotal()));
		salesPO.setOtherStatus(salesVO.getOtherStatus());
		
		salesDao.update(salesPO);
		salesItemDao.save(salesItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSalesItem(SalesItemVO salesItemVO)throws FLException {
		
		SalesItemPO salesItemPO = salesItemDao.querySalesItemBySiid(salesItemVO.getSiid());
		
		if(salesItemPO == null){
			throw new FLException(260023, "销售项不存在");
		}
		
		SalesPO salesPO = salesDao.querySalesBySid(salesItemPO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}
		
		salesPO.setTotal(Arith.add(Arith.sub(salesPO.getTotal(), salesItemPO.getTotal()), salesItemVO.getTotal()));
		
		salesItemPO.setNum(salesItemVO.getNum());
		salesItemPO.setTotal(salesItemVO.getTotal());
		salesItemPO.setComment(salesItemVO.getComment());
	
		salesDao.update(salesPO);
		salesItemDao.update(salesItemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteSalesItem(SalesItemVO salesItemVO)throws FLException {
		
		SalesItemPO salesItemPO = salesItemDao.querySalesItemBySiid(salesItemVO.getSiid());
		
		if(salesItemPO == null){
			throw new FLException(260023, "销售项不存在");
		}
		
		SalesPO salesPO = salesDao.querySalesBySid(salesItemPO.getSid());
		
		if(salesPO == null){
			throw new FLException(260021, "销售单不存在");
		}
		
		if(salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT){
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setTotal(Arith.sub(salesPO.getTotal(), salesItemPO.getTotal()));
		salesItemDao.delete(salesItemPO);
		
		return 0;
	}

}

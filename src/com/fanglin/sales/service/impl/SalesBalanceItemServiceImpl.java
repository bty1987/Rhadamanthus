package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.po.SalesBalanceItemPO;
import com.fanglin.sales.service.SalesBalanceItemService;
import com.fanglin.sales.vo.SalesBalanceItemVO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.utils.BeanUtil;

@Service("salesBalanceItemService")
@Transactional(readOnly=true)
public class SalesBalanceItemServiceImpl implements SalesBalanceItemService{
	
	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao;

	@Override
	public List<SalesBalanceItemVO> querySalesBalanceItemBySbid(SalesBalanceVO salesBalanceVO) {
		
		List<SalesBalanceItemPO> salesBalanceItemPOs = salesBalanceItemDao.querySalesBalanceItemBySbid(salesBalanceVO.getSbid());
		List<SalesBalanceItemVO> salesBalanceItemVOs = new ArrayList<SalesBalanceItemVO>();
		
		for(SalesBalanceItemPO salesBalanceItemPO : salesBalanceItemPOs){
			
			SalesBalanceItemVO salesBalanceItemVO = new SalesBalanceItemVO(new SalesItemVO(new GoodsVO(),new ColorVO(),new FormatVO()));
			
			BeanUtil.copyPropertie(salesBalanceItemPO, salesBalanceItemVO, Arrays.asList("salesItem"));
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem(), salesBalanceItemVO.getSalesItem(), Arrays.asList("goods","color","format"));
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getGoods(), salesBalanceItemVO.getSalesItem().getGoods(),Arrays.asList("accessoriesType"));
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getColor(), salesBalanceItemVO.getSalesItem().getColor());
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getFormat(), salesBalanceItemVO.getSalesItem().getFormat());
			
			salesBalanceItemVOs.add(salesBalanceItemVO);
			
		}
		
		return salesBalanceItemVOs;
		
	}

}

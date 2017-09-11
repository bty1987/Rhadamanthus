package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.SalesBalanceItemDao;
import com.fanglin.inventory.po.SalesBalanceItemPO;
import com.fanglin.inventory.service.SalesBalanceItemService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.SalesBalanceItemVO;
import com.fanglin.inventory.vo.SalesBalanceVO;
import com.fanglin.inventory.vo.SalesItemVO;
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
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getGoods(), salesBalanceItemVO.getSalesItem().getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getColor(), salesBalanceItemVO.getSalesItem().getColor());
			BeanUtil.copyPropertie(salesBalanceItemPO.getSalesItem().getFormat(), salesBalanceItemVO.getSalesItem().getFormat());
			
			salesBalanceItemVOs.add(salesBalanceItemVO);
			
		}
		
		return salesBalanceItemVOs;
		
	}

}

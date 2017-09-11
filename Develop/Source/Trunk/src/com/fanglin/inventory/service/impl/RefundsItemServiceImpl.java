package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.dao.RefundsItemDao;
import com.fanglin.inventory.po.RefundsItemPO;
import com.fanglin.inventory.service.RefundsItemService;
import com.fanglin.inventory.vo.RefundsItemVO;
import com.fanglin.inventory.vo.RefundsVO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.utils.BeanUtil;


@Service("RefundsItemService")
@Transactional(readOnly=true)
public class RefundsItemServiceImpl implements RefundsItemService {

	@Autowired 
	private RefundsItemDao refundsItemDao;
	
	@Override
	public List<RefundsItemVO> queryRefundsItemBySid(RefundsVO refundsVO) {
		
		List<RefundsItemPO> RefundsItemPOs=refundsItemDao.queryRefundsItemBySid(refundsVO.getSid());
		List<RefundsItemVO> RefundsItemVOs=new ArrayList<RefundsItemVO>();
		
		
		for(RefundsItemPO refundsItemPO:RefundsItemPOs){
			
			RefundsItemVO refundItemVO = new RefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));
			
			BeanUtil.copyProperties(refundsItemPO, refundItemVO,Arrays.asList("salesItem"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem(), refundItemVO.getSalesItem(), Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getGoods(), refundItemVO.getSalesItem().getGoods(),Arrays.asList("assisType"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getColor(), refundItemVO.getSalesItem().getColor());
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getFormat(), refundItemVO.getSalesItem().getFormat());
			

			RefundsItemVOs.add(refundItemVO);
		}
		
		return RefundsItemVOs;
	}

}

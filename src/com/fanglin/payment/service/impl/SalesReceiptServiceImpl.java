package com.fanglin.payment.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.payment.service.SalesReceiptService;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("salesReceiptService")
@Transactional(readOnly=true)
public class SalesReceiptServiceImpl implements SalesReceiptService {

	@Autowired
	private SalesReceiptDao salesReceiptDao;
	
	@Override
	public SalesReceiptVO querySalesReceiptBySrId(SalesReceiptVO salesReceiptVO){
		
		SalesReceiptPO salesReceiptPO = salesReceiptDao.querySalesReceiptBySrId(salesReceiptVO.getSrId());
		
		salesReceiptVO = new SalesReceiptVO(new UserBaseVO(),new UserBaseVO());
		
		BeanUtil.copyProperties(salesReceiptPO, salesReceiptVO, Arrays.asList("collecter","confirmer"));
		BeanUtil.copyProperties(salesReceiptPO.getCollecter(), salesReceiptVO.getCollecter(), Arrays.asList("dept","duty"));
		BeanUtil.copyProperties(salesReceiptPO.getConfirmer(), salesReceiptVO.getConfirmer(), Arrays.asList("dept","duty"));
		
		return salesReceiptVO;
		
	}
	
}

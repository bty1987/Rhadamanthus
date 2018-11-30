package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.ReceiptDao;
import com.fanglin.payment.po.ReceiptPO;
import com.fanglin.payment.service.ReceiptService;
import com.fanglin.payment.vo.ReceiptVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("receiptService")
@Transactional(readOnly = true)
public class ReceiptServiceImpl implements ReceiptService {
	
	@Autowired
	private ReceiptDao receiptDao;

	@Override
	public void pageReceipt(Paging paging, List<Filter> filters, int company) {
		List<ReceiptPO> receiptPOs = receiptDao.pageReceipt(paging, filters, company);
		List<ReceiptVO> receiptVOs = new ArrayList<ReceiptVO>();
		
		ReceiptVO receiptVO = null;
		
		for (ReceiptPO receiptPO : receiptPOs) {
			receiptVO = new ReceiptVO();
			BeanUtil.copyProperties(receiptPO, receiptVO);
			receiptVOs.add(receiptVO);
		}
		
		paging.setData(receiptVOs);

	}

}

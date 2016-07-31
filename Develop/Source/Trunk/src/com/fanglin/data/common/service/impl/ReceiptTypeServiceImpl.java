/**
 * @File Name		: ReceiptTypeServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.common.service.ReceiptTypeService;
import com.fanglin.data.common.vo.ReceiptTypeVO;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("receiptTypeService")
@Transactional(readOnly=true)
public class ReceiptTypeServiceImpl implements ReceiptTypeService {
	
	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Override
	public void pageReceiptType(Paging paging, List<FilterVO> filters) {
		
		List<ReceiptTypePO> receiptTypePOs = receiptTypeDao.pageReceiptType(paging, filters);
		List<ReceiptTypeVO> receiptTypeVOs = new ArrayList<ReceiptTypeVO>();
		
		for(ReceiptTypePO receiptTypePO: receiptTypePOs){
			ReceiptTypeVO receiptTypeVO = new ReceiptTypeVO();
			
			BeanUtil.copyProperties(receiptTypePO, receiptTypeVO);
			
			receiptTypeVOs.add(receiptTypeVO);
		}

		paging.setData(receiptTypeVOs);
	}

	@Override
	public List<ReceiptTypeVO> queryReceiptType() {
		
		List<ReceiptTypePO> receiptTypePOs = receiptTypeDao.queryReceiptType();
		List<ReceiptTypeVO> receiptTypeVOs = new ArrayList<ReceiptTypeVO>();
		
		for(ReceiptTypePO receiptTypePO: receiptTypePOs){
			ReceiptTypeVO receiptTypeVO = new ReceiptTypeVO();
			
			BeanUtil.copyProperties(receiptTypePO, receiptTypeVO);
			
			receiptTypeVOs.add(receiptTypeVO);
		}
		
		return receiptTypeVOs;
	}

	@Override
	public List<ReceiptTypeVO> queryReceiptTypeByType(ReceiptTypeVO receiptTypeVO) {

		List<ReceiptTypePO> receiptTypePOs = receiptTypeDao.queryReceiptTypeByType(receiptTypeVO.getType());
		List<ReceiptTypeVO> receiptTypeVOs = new ArrayList<ReceiptTypeVO>();
		
		for(ReceiptTypePO receiptTypePO: receiptTypePOs){
			ReceiptTypeVO _receiptTypeVO = new ReceiptTypeVO();
			
			BeanUtil.copyProperties(receiptTypePO, _receiptTypeVO);
			
			receiptTypeVOs.add(_receiptTypeVO);
		}
		
		return receiptTypeVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addReceiptType(ReceiptTypeVO receiptTypeVO) throws FLException {
		
		ReceiptTypePO receiptTypePO = receiptTypeDao.queryReceiptTypeByKey(receiptTypeVO.getKey());
		
		if(receiptTypePO != null){
			throw new FLException(130004, "收据类型键值已存在");
		}
		
		receiptTypePO = new ReceiptTypePO();
		
		BeanUtil.copyProperties(receiptTypeVO, receiptTypePO);
		
		receiptTypeDao.save(receiptTypePO);
		
		return 0;
	}

}

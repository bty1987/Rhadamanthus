/**
 * @File Name		: DecorationReceiptServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.service.DecorationReceiptService;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("decorationReceiptService")
@Transactional(readOnly=true)
public class DecorationReceiptServiceImpl implements DecorationReceiptService {
	
	@Autowired
	private DecorationReceiptDao decorationReceiptDao;

	@Override
	public DecorationReceiptVO queryDecorationReceiptByDrId(DecorationReceiptVO decorationReceiptVO) throws FLException {
		
		DecorationReceiptPO decorationReceiptPO = decorationReceiptDao.get(decorationReceiptVO.getDrId());
		
		if(decorationReceiptPO == null){
			throw new FLException(150026, "收据不存在");
		}
		
		BeanUtil.copyProperties(decorationReceiptPO, decorationReceiptVO);
		
		if(decorationReceiptPO.getCollectUserPO() != null){
			UserPO collectUserPO = decorationReceiptPO.getCollectUserPO();
			
			decorationReceiptVO.setCollectUserId(collectUserPO.getUserId());
			decorationReceiptVO.setCollectUserName(collectUserPO.getUserName());
		}
		
		if(decorationReceiptPO.getConfirmUserPO() != null){
			UserPO confirmUserPO = decorationReceiptPO.getConfirmUserPO();
			
			decorationReceiptVO.setConfirmUserId(confirmUserPO.getUserId());
			decorationReceiptVO.setConfirmUserName(confirmUserPO.getUserName());
		}
		
		return decorationReceiptVO;
	}

	@Override
	public List<DecorationReceiptVO> queryDecorationReceiptByDrIds(List<Long> drIds) {
		
		List<DecorationReceiptPO> decorationReceiptPOs = decorationReceiptDao.queryDecorationReceiptByDrIds(drIds);
		List<DecorationReceiptVO> decorationReceiptVOs = new ArrayList<DecorationReceiptVO>();
		
		for(DecorationReceiptPO decorationReceiptPO: decorationReceiptPOs){
			DecorationReceiptVO decorationReceiptVO = new DecorationReceiptVO();
			BeanUtil.copyProperties(decorationReceiptPO, decorationReceiptVO);
			
			if(decorationReceiptPO.getCollectUserPO() != null){
				UserPO collectUserPO = decorationReceiptPO.getCollectUserPO();
				
				decorationReceiptVO.setCollectUserId(collectUserPO.getUserId());
				decorationReceiptVO.setCollectUserName(collectUserPO.getUserName());
			}
			
			if(decorationReceiptPO.getConfirmUserPO() != null){
				UserPO confirmUserPO = decorationReceiptPO.getConfirmUserPO();
				
				decorationReceiptVO.setConfirmUserId(confirmUserPO.getUserId());
				decorationReceiptVO.setConfirmUserName(confirmUserPO.getUserName());
			}
			
			decorationReceiptVOs.add(decorationReceiptVO);
		}
		
		return decorationReceiptVOs;
	}

}

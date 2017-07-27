/**
 * @File Name		: BackVisitServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.BackVisitDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.BackVisitPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.BackVisitService;
import com.fanglin.decoration.vo.BackVisitVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("backVisitService")
@Transactional(readOnly=true)
public class BackVisitServiceImpl implements BackVisitService {

	@Autowired
	private BackVisitDao backVisitDao;
	
	@Autowired
	private DecorationOrderDao  decorationOrderDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageBackVisitByOrderId(Paging paging, List<Filter> filters, BackVisitVO backVisitVO){
		
		List<BackVisitVO> backVisitVOs = new ArrayList<BackVisitVO>();
		List<BackVisitPO> backVisitPOs = backVisitDao.pageBackVisitByOrderId(paging, filters, backVisitVO.getOrderId());
		
		for(BackVisitPO backVisitPO: backVisitPOs){
			BackVisitVO _backVisitVO = new BackVisitVO();
			
			BeanUtil.copyProperties(backVisitPO, _backVisitVO, Arrays.asList("decorationOrder", "sender"));
			
			UserPO sender = backVisitPO.getSender();
			
			_backVisitVO.setOrderId(backVisitPO.getDecorationOrder().getOrderId());
			_backVisitVO.setSender(sender.getCurrentName());
			_backVisitVO.setSenderId(sender.getUserId());
			_backVisitVO.setSenderPhoto(sender.getUserPhoto());
			
			backVisitVOs.add(_backVisitVO);
		}
		
		paging.setData(backVisitVOs);
	}
	
	@Override
	public List<BackVisitVO> queryBackVisitByOrderId(BackVisitVO backVisitVO) {
		
		List<BackVisitPO> backVisitPOs = backVisitDao.queryBackVisitByOrderId(backVisitVO.getOrderId());
		List<BackVisitVO> backVisitVOs = new ArrayList<BackVisitVO>();
		
		for(BackVisitPO backVisitPO: backVisitPOs){
			BackVisitVO _backVisitVO = new BackVisitVO();
			
			BeanUtil.copyProperties(backVisitPO, _backVisitVO, Arrays.asList("decorationOrder", "sender"));
			
			UserPO sender = backVisitPO.getSender();
			
			_backVisitVO.setOrderId(backVisitPO.getDecorationOrder().getOrderId());
			_backVisitVO.setSender(sender.getCurrentName());
			_backVisitVO.setSenderId(sender.getUserId());
			_backVisitVO.setSenderPhoto(sender.getUserPhoto());
			
			backVisitVOs.add(_backVisitVO);
		}
		
		return backVisitVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBackVisit(BackVisitVO backVisitVO, String userId) throws FLException{
		
		String orderId = backVisitVO.getOrderId();
		
		BackVisitPO backVisitPO = new BackVisitPO();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		BeanUtil.copyProperties(backVisitVO, backVisitPO, Arrays.asList("decorationOrder", "sender"));
		
		backVisitPO.setDecorationOrder(decorationOrderPO);
		backVisitPO.setSender(userPO);
		backVisitPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		StringBuffer receiverIds = new StringBuffer();
		
		if(backVisitVO.getReceivers() != null && backVisitVO.getReceivers().size() > 0){
			
			List<String> receivers = backVisitVO.getReceivers();
			
			for(String receiverId: receivers){
//				messageDDService.sendMessageForBackVisit(receiverId.trim(), String.format("%s的回访", userPO.getCurrentName()), orderId, backVisitVO.getContent());
				receiverIds.append(String.format("%s,", receiverId));
			}
		}
		
		backVisitPO.setReceiverIds(receiverIds.toString());
		
		backVisitDao.save(backVisitPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteBackVisitById(BackVisitVO orderDesignPicture){	
		backVisitDao.deleteById(orderDesignPicture.getBvId());
	}

}

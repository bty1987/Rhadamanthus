/**
 * @File Name		: DecorationActivityServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2015-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
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
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationActivityVO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationActivityService")
@Transactional(readOnly=true)
public class DecorationActivityServiceImpl implements DecorationActivityService {
	
	@Autowired
	private DecorationActivityDao decorationActivityDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private ActivityDao activityDao;

	@Override
	public List<DecorationActivityVO> queryDecorationActivityByOrderId(DecorationActivityVO decorationActivityVO) {
		
		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(decorationActivityVO.getOrderId());
		List<DecorationActivityVO> decorationActivityVOs = new ArrayList<DecorationActivityVO>();
		
		for(DecorationActivityPO decorationActivityPO: decorationActivityPOs){
			decorationActivityVO = new DecorationActivityVO();
			
			BeanUtil.copyProperties(decorationActivityPO, decorationActivityVO, Arrays.asList("activity"));
			
			decorationActivityVO.setActivity(new ActivityVO());
			BeanUtil.copyProperties(decorationActivityPO.getActivity(), decorationActivityVO.getActivity(), Arrays.asList("creater"));
			
			decorationActivityVOs.add(decorationActivityVO);
		}
		
		return decorationActivityVOs;
	}

	@Override
	public DecorationActivityVO amountDecorationActivity(DecorationActivityVO decorationActivityVO, DecorationActivityItemVO decorationActivityItemVO) throws FLException {

		long amount = decorationActivityDao.amountDecorationActivity(decorationActivityVO.getOrderId(), decorationActivityItemVO.getType(), decorationActivityItemVO.getIsPrefor(), decorationActivityItemVO.getIsPayment());

		DecorationActivityVO decorationActivity = new DecorationActivityVO();

		decorationActivity.setOrderId(decorationActivityVO.getOrderId());
		decorationActivity.setAmount(amount);

		return decorationActivity;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityVO.getOrderId());
		
		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT,DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!statuses.contains(decorationPO.getStatus())){
			throw new FLException(140003, "装修单已签约");
		}
		
		ActivityPO activityPO = activityDao.get(decorationActivityVO.getActivity().getAid());
		
		if(activityPO == null){
			throw new FLException(160011, "活动信息不存在");
		}
		
		if(decorationActivityDao.countDecorationActivity(decorationPO.getOrderId(), null) >= 1){
			throw new FLException(140061, "已参加活动");
		}
		
		if(activityPO.getEndTime().getTime() < DateUtil.getDateToTimestamp(new Date()).getTime()){
			throw new FLException(140032, "活动已过期");
		}
		
		DecorationActivityPO decorationActivityPO = new DecorationActivityPO();
		
		decorationActivityPO.setOrderId(decorationActivityVO.getOrderId());
		decorationActivityPO.setActivity(activityPO);
		
		decorationActivityDao.save(decorationActivityPO);
		
		BeanUtil.copyProperties(decorationActivityPO, decorationActivityVO, Arrays.asList("activity"));
		
		decorationActivityVO.setActivity(new ActivityVO());
		BeanUtil.copyProperties(decorationActivityPO.getActivity(), decorationActivityVO.getActivity(), Arrays.asList("creater"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationActivityPO decorationActivityPO = decorationActivityDao.get(decorationActivityVO.getDaId());
		
		if(decorationActivityPO == null){
			throw new FLException(140033, "订单活动信息不存在");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityPO.getOrderId());
		
		if (decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT,DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);
		
		if(!statuses.contains(decorationPO.getStatus())){
			throw new FLException(140003, "装修单已签约");
		}
		
		decorationActivityDao.delete(decorationActivityPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int lockDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationActivityPO decorationActivityPO = decorationActivityDao.get(decorationActivityVO.getDaId());
		
		if(decorationActivityPO == null){
			throw new FLException(140033, "订单活动信息不存在");
		}
		
		if(decorationActivityPO.getStatus() != DecorationActivityPO.STATUS_INIT_INT){
			throw new FLException(140059, "订单活动状态不可操作");
		}
		
		decorationActivityPO.setStatus(DecorationActivityPO.STATUS_LOCK_INT);
		
		decorationActivityDao.update(decorationActivityPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int unlockDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationActivityPO decorationActivityPO = decorationActivityDao.get(decorationActivityVO.getDaId());
		
		if(decorationActivityPO == null){
			throw new FLException(140033, "订单活动信息不存在");
		}
		
		if(decorationActivityPO.getStatus() != DecorationActivityPO.STATUS_LOCK_INT){
			throw new FLException(140059, "订单活动状态不可操作");
		}
		
		decorationActivityPO.setStatus(DecorationActivityPO.STATUS_INIT_INT);
		
		decorationActivityDao.update(decorationActivityPO);
		
		return 0;
	}

}

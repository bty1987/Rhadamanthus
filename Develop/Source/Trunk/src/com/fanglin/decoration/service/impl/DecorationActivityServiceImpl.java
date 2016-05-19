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
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.DecorationActivityService;
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
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private ActivityDao activityDao;

	@Override
	public List<DecorationActivityVO> queryDecorationActivityByOrderId(DecorationActivityVO decorationActivityVO) {
		
		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(decorationActivityVO.getOrderId());
		List<DecorationActivityVO> decorationActivityVOs = new ArrayList<DecorationActivityVO>();
		
		for(DecorationActivityPO decorationActivityPO: decorationActivityPOs){
			DecorationActivityVO _decorationActivityVO = new DecorationActivityVO();
			
			BeanUtil.copyProperties(decorationActivityPO, _decorationActivityVO, Arrays.asList("activity"));
			
			_decorationActivityVO.setActivity(new ActivityVO());
			BeanUtil.copyProperties(decorationActivityPO.getActivity(), _decorationActivityVO.getActivity());
			
			decorationActivityVOs.add(_decorationActivityVO);
		}
		
		return decorationActivityVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(decorationActivityVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		ActivityPO activityPO = activityDao.get(decorationActivityVO.getActivity().getAid());
		
		if(activityPO == null){
			throw new FLException(160011, "活动信息不存在");
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
		BeanUtil.copyProperties(decorationActivityPO.getActivity(), decorationActivityVO.getActivity());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException {
		
		DecorationActivityPO decorationActivityPO = decorationActivityDao.get(decorationActivityVO.getDaId());
		
		if(decorationActivityPO == null){
			throw new FLException(140033, "订单活动信息不存在");
		}
		
		decorationActivityDao.delete(decorationActivityPO);
		
		return 0;
	}

}

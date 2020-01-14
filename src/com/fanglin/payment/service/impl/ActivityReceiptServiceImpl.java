package com.fanglin.payment.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.dao.ActivityReceiptDao;
import com.fanglin.payment.po.ActivityReceiptPO;
import com.fanglin.payment.service.ActivityReceiptService;
import com.fanglin.payment.vo.ActivityReceiptVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("activityReceiptService")
@Transactional(readOnly=true)
public class ActivityReceiptServiceImpl implements ActivityReceiptService {
	
	@Autowired
	private ActivityReceiptDao activityReceiptDao;

	@Override
	public ActivityReceiptVO queryActivityReceiptByArid(ActivityReceiptVO activityReceiptVO) {
		
		ActivityReceiptPO activityReceiptPO = activityReceiptDao.get(activityReceiptVO.getArid());
		
		activityReceiptVO = new ActivityReceiptVO(new UserBaseVO());
		
		BeanUtil.copyProperties(activityReceiptPO, activityReceiptVO, Arrays.asList("collecter"));
		BeanUtil.copyProperties(activityReceiptPO.getCollecter(), activityReceiptVO.getCollecter(), Arrays.asList("dept","duty"));
		
		return activityReceiptVO;
	}

}

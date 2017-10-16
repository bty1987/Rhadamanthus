package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.information.dao.PhoneCallDao;
import com.fanglin.information.po.PhoneCallPO;
import com.fanglin.information.service.PhoneCallService;
import com.fanglin.information.vo.PhoneCallVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("phoneCallService")
@Transactional(readOnly=true)
public class PhoneCallServiceImpl implements PhoneCallService {
	
	@Autowired
	private PhoneCallDao phoneCallDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao; 

	@Override
	public void pagePhoneCall(Paging paging, List<Filter> filters) throws FLException {
		
		List<PhoneCallPO> phoneCallPOs = phoneCallDao.pagePhoneCall(paging, filters);
		
		List<PhoneCallVO> phoneCallVOs = new ArrayList<PhoneCallVO>();
		
		for(PhoneCallPO phoneCallPO: phoneCallPOs){
			
			phoneCallVOs.add(convertBean(phoneCallPO));
		}
		
		paging.setData(phoneCallVOs);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int phoneCall(PhoneCallVO phoneCall) throws FLException {
		PhoneCallPO phoneCallPO =new PhoneCallPO(new UserPO());
		
		PhoneCallPO phonecall = phoneCallDao.queryPhoneCallByCallerACallee(phoneCall.getCaller(), phoneCall.getCallee());
		
		if(phonecall != null){
			throw new FLException(160023, "电话拨通中");
		}
		
		UserPO userPO = userDao.queryUserByUserId(phoneCall.getOperater().getUserId());
		
		phoneCallPO.setOperater(userPO);
		
		phoneCallPO.setCaller(phoneCall.getCaller());
		
		phoneCallPO.setCallee(phoneCall.getCallee());
		
		phoneCallPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		
		phoneCallDao.save(phoneCallPO);
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		String url = String.format(PhoneCallPO.PHONECALLPO_PHONECALLBACK_STR,isv.getValue(),"86"+phoneCall.getCaller(),"86"+phoneCall.getCallee(),phoneCallPO.getPcid());
		
		HttpHelper.httpGet(url);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePhoneCallForInfo(PhoneCallVO phoneCall) throws FLException {
	
		PhoneCallPO phoneCallPO = phoneCallDao.queryPhoneCallByCallBackId(phoneCall.getCallbackId());
		
		if(phoneCallPO == null){
			throw new FLException(190005, "人员不存在");
		}
	
		phoneCallPO.setStartTime(DateUtil.getDateToTimestamp(phoneCall.getStartTime()));
		
		phoneCallPO.setEndTime(DateUtil.getDateToTimestamp(phoneCall.getEndTime()));
		
		phoneCallPO.setStopReason(phoneCall.getStopReason());
	
		phoneCallPO.setDuration(phoneCall.getDuration());
		
		phoneCallDao.update(phoneCallPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePhoneCallForRecord(PhoneCallVO phoneCall) throws FLException {
		
		PhoneCallPO phoneCallPO = phoneCallDao.queryPhoneCallByCallBackId(phoneCall.getCallbackId());
		
		if(phoneCallPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		phoneCallPO.setRecordType(phoneCall.getRecordType());
		
		phoneCallPO.setRecordUrl(phoneCall.getRecordUrl());

		phoneCallDao.update(phoneCallPO);
	
		return 0;
	}

	private PhoneCallVO convertBean(PhoneCallPO phoneCallPO) throws FLException{
		
		PhoneCallVO phoneCallVO = new PhoneCallVO(new UserVO());
		
		BeanUtil.copyProperties(phoneCallPO, phoneCallVO, Arrays.asList("operater"));

		BeanUtil.copyProperties(phoneCallPO.getOperater(), phoneCallVO.getOperater(), Arrays.asList("role", "dept"));
		
		return phoneCallVO;
	}
	
	

}

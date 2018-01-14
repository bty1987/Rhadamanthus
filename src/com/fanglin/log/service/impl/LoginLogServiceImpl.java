package com.fanglin.log.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.LoginLogDao;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.log.service.LoginLogService;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("loginLogService")
@Transactional(readOnly = true)
public class LoginLogServiceImpl implements LoginLogService {


	@Autowired
	private LoginLogDao loginLogDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addLoginLog(LoginLogVO loginLog){

		LoginLogPO loginLogPO = new LoginLogPO();
		
		BeanUtil.copyProperties(loginLog, loginLogPO);
		loginLogPO.setId("");
		
		Timestamp beforeTime = new Timestamp(DateUtil.getTimestampToDate(loginLogPO.getLoginTime()).getTime() - SystemConfig.getInt("recordLoginLogDay", 30) * 24 * 60*60*1000L);
		
		loginLogDao.delteBeforLoginTime(beforeTime);
		
		loginLogDao.save(loginLogPO);
		
		return 0;
	}

	@Override
	public void pageLoginLog(Paging paging, List<Filter> filters){
		List<LoginLogPO> loginLogPOs = loginLogDao.getPageLoginLog(paging, filters);
		List<LoginLogVO> loginLogVOs = new ArrayList<LoginLogVO>();
		
		for(LoginLogPO loginLogPO: loginLogPOs){
			LoginLogVO loginLogVO = new LoginLogVO();
			BeanUtil.copyProperties(loginLogPO, loginLogVO);
			
			loginLogVOs.add(loginLogVO);
		}
		
		paging.setData(loginLogVOs);
	}
	
	@Override
	public int isCanLogin(LoginLogVO loginLogVO){
		int res = 0;
		
		Timestamp startTime = new Timestamp(DateUtil.getTimestampToDate(loginLogVO.getLoginTime()).getTime() - SystemConfig.getInt("refuseLoginStatMin", 5) * 60 * 1000);
		
		List<LoginLogPO> loginLogPOs = loginLogDao.getLoginLogByLoginIdAndStartEndTime(loginLogVO.getLoginId(), startTime, loginLogVO.getLoginTime());

		int failCount = 0;
		for(LoginLogPO loginLogPO: loginLogPOs){
			if(loginLogPO.getSuccessFlag() == 0){
				failCount++;
			}else{
				break;
			}
		}
		
		if(failCount >= SystemConfig.getInt("refuseLoginTimes",5)){
			res = -1;
		}else{
			res = SystemConfig.getInt("refuseLoginTimes",5)-failCount;
		}
		return res;
	}

}

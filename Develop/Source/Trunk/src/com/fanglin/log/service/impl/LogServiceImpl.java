/**
 * @File Name		: LogServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.log.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.log.dao.ActionLogDao;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.service.LogService;
import com.fanglin.log.vo.LogVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("logService")
@Transactional(readOnly=true)
public class LogServiceImpl implements LogService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private ActionLogDao actionLogDao;
	
	@Transactional(rollbackFor=Exception.class)
	public int addActionLog(LogVO logVO){
		ActionLogPO actionLogPO = new ActionLogPO();
		BeanUtil.copyProperties(logVO, actionLogPO);
		actionLogPO.setCreateUserPO(new UserPO(logVO.getCreateUserId()));
		
		actionLogDao.save(actionLogPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addActionLog(ActionLogPO actionLogPO){
		
		actionLogDao.save(actionLogPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addLog(LogVO logVO){
		addActionLog(logVO);
		return 0;
	}
	
	@Override
	public void pageActionLog(Paging paging, List<FilterVO> filters){
		List<LogVO> logVOs = new ArrayList<LogVO>();
		List<ActionLogPO> actionLogPOs = actionLogDao.getPageActionLogPOs(paging, filters);
		
		for(ActionLogPO actionLogPO: actionLogPOs){
			LogVO logVO = changeActionLogPOToVO(actionLogPO);
			logVOs.add(logVO);
		}
		
		paging.setData(logVOs);
	}

	@Override
	public List<LogVO> getAllPageActionLogs(List<FilterVO> filters){
		
		List<LogVO> logVOs = new ArrayList<LogVO>();
		List<ActionLogPO> actionLogPOs = actionLogDao.getAllPageActionLogPOs(filters);
		
		for(ActionLogPO actionLogPO: actionLogPOs){
			LogVO logVO = changeActionLogPOToVO(actionLogPO);
			logVOs.add(logVO);
		}
		return logVOs;
	}
	
	private LogVO changeActionLogPOToVO(ActionLogPO actionLogPO){
		LogVO logVO = new LogVO();
		
		BeanUtil.copyProperties(actionLogPO, logVO);
		logVO.setCreateUserId(actionLogPO.getCreateUserPO().getUserId());
		logVO.setCreateUserName(actionLogPO.getCreateUserPO().getCurrentName());
		logVO.setDuty(actionLogPO.getCreateUserPO().getDuty());
		logVO.setRoleId(actionLogPO.getCreateUserPO().getRole().getRoleId());
		logVO.setRoleName(actionLogPO.getCreateUserPO().getRole().getRoleName());
		
		return logVO;
	}

}

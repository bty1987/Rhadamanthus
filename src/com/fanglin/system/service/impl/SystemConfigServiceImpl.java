package com.fanglin.system.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.service.SystemConfigService;
import com.fanglin.system.vo.SystemConfigVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("systemConfigService")
@Transactional(readOnly = true)
public class SystemConfigServiceImpl implements SystemConfigService{
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<SystemConfigVO> pageSystemConfig(Paging paging,List<Filter> filters) {
	
		List<SystemConfigPO> systemConfigPOs = systemConfigDao.pageSystemConfig(paging,filters);
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();
		
		SystemConfigVO systemConfigVO;
		
		for (SystemConfigPO systemConfigPO : systemConfigPOs) {
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			
			systemConfigVO = new SystemConfigVO();
			
			BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("userPO","createTime","cuid","createName"));
			
			systemConfigVO.setCuid(systemConfigPO.getUserPO().getUid());
			
			systemConfigVO.setCreateName(systemConfigPO.getUserPO().getUserName());
			
			systemConfigVO.setCreateTime(dateFormat.format(systemConfigPO.getCreateTime()));
			
			systemConfigVOs.add(systemConfigVO);
			
		}
		paging.setData(systemConfigVOs);
		
		return systemConfigVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSystemConfig(SystemConfigVO systemConfigVO)throws FLException {
		
		SystemConfigPO systemConfigPO = systemConfigDao.get(systemConfigVO.getScid());
		
		if(systemConfigPO == null){
			throw new FLException(130013, "系统配置不存在");
		}
		
		systemConfigPO.setValue(systemConfigVO.getValue());
		systemConfigPO.setComment(systemConfigVO.getComment());
		
		systemConfigDao.update(systemConfigPO);
		
		return 0;
	}

	@Override
	public List<SystemConfigVO> querySystemConfigByCid(Integer company) { 
		
		List<SystemConfigPO> systemConfigPOs = systemConfigDao.querySystemConfigByCid(company);
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();
		
		SystemConfigVO systemConfigVO;
		
		for (SystemConfigPO systemConfigPO : systemConfigPOs) {
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			
			systemConfigVO = new SystemConfigVO();
			
			BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("userPO","createTime","cuid","createName"));
			
			systemConfigVO.setCuid(systemConfigPO.getUserPO().getUid());
			
			systemConfigVO.setCreateName(systemConfigPO.getUserPO().getUserName());
			
			systemConfigVO.setCreateTime(dateFormat.format(systemConfigPO.getCreateTime()));
			
			systemConfigVOs.add(systemConfigVO);
			
		}
		
		return systemConfigVOs;
	}
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addSystemConfig(SystemConfigVO systemConfigVO,String userId) throws FLException {

		SystemConfigPO systemConfigPOs = systemConfigDao.querySystemConfig(systemConfigVO.getKey());
		
		if(systemConfigPOs != null){
			throw new FLException(110000, "系统处理问题");
		}
		SystemConfigPO systemConfigPO = new SystemConfigPO();
		
		systemConfigPO.setKey(systemConfigVO.getKey());
		
		systemConfigPO.setValue(systemConfigVO.getValue());
		
		systemConfigPO.setUserPO(userDao.queryUserByUserId(userId));
		
		systemConfigPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
	
		systemConfigPO.setComment(systemConfigVO.getComment());
		
		systemConfigDao.save(systemConfigPO);
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteSystemConfig(SystemConfigVO systemConfigVO) throws FLException {
		
		systemConfigDao.deleteById(systemConfigVO);
		
	}

}

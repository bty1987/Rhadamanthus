package com.fanglin.system.service.impl;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
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

	@Override
	public List<SystemConfigVO> pageSystemConfig(Paging paging,List<Filter> filters) {
	
		List<SystemConfigPO> systemConfigPOs = systemConfigDao.pageSystemConfig(paging,filters);
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();
		
		SystemConfigVO systemConfigVO;
		
		for (SystemConfigPO systemConfigPO : systemConfigPOs) {
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			
			systemConfigVO = new SystemConfigVO();
			
			BeanUtil.copyProperties(systemConfigPO, systemConfigVO,"UserPO");
			
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

}

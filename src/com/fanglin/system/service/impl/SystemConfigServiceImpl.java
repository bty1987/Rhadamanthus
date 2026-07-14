package com.fanglin.system.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.service.SystemConfigService;
import com.fanglin.system.vo.SystemConfigVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("systemConfigService")
@Transactional(readOnly = true)
public class SystemConfigServiceImpl implements SystemConfigService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageSystemConfig(Paging paging, List<Filter> filters) throws FLException {

		List<SystemConfigPO> systemConfigPOs = systemConfigDao.pageSystemConfig(paging, filters);
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();

		SystemConfigVO systemConfigVO;

		for (SystemConfigPO systemConfigPO : systemConfigPOs) {

			systemConfigVO = new SystemConfigVO(new UserBaseVO());

			BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(systemConfigPO.getCreater(), systemConfigVO.getCreater(), Arrays.asList("dept", "duty"));

			systemConfigVOs.add(systemConfigVO);
		}

		paging.setData(systemConfigVOs);
	}

	@Override
	public List<SystemConfigVO> querySystemConfigByCid(SystemConfigVO systemConfigVO) {

		List<SystemConfigPO> systemConfigPOs = systemConfigDao.querySystemConfigByCid(systemConfigVO.getCompany());
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();

		for (SystemConfigPO systemConfigPO : systemConfigPOs) {

			systemConfigVO = new SystemConfigVO(new UserBaseVO());

			BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(systemConfigPO.getCreater(), systemConfigVO.getCreater(), Arrays.asList("dept", "duty"));

			systemConfigVOs.add(systemConfigVO);
		}

		return systemConfigVOs;
	}

	@Override
	public List<SystemConfigVO> querySystemConfigByGroup(SystemConfigVO systemConfigVO, Integer company) {

		List<SystemConfigPO> systemConfigPOs = systemConfigDao.querySystemConfigByGroup(systemConfigVO.getGroup(), company);
		List<SystemConfigVO> systemConfigVOs = new ArrayList<SystemConfigVO>();

		for (SystemConfigPO systemConfigPO : systemConfigPOs) {

			systemConfigVO = new SystemConfigVO(new UserBaseVO());

			BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(systemConfigPO.getCreater(), systemConfigVO.getCreater(), Arrays.asList("dept", "duty"));

			systemConfigVOs.add(systemConfigVO);
		}

		return systemConfigVOs;
	}

	@Override
	public SystemConfigVO querySystemConfigByKey(SystemConfigVO systemConfigVO, Integer company) {

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(systemConfigVO.getKey(), company);

		if (systemConfigPO == null) return systemConfigVO;

		systemConfigVO.setCreater(new UserBaseVO());

		BeanUtil.copyProperties(systemConfigPO, systemConfigVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(systemConfigPO.getCreater(), systemConfigVO.getCreater(), Arrays.asList("dept", "duty"));

		return systemConfigVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSystemConfig(SystemConfigVO systemConfigVO) throws FLException {

		SystemConfigPO systemConfigPO = systemConfigDao.get(systemConfigVO.getScid());

		if (systemConfigPO == null) {
			throw new FLException(130013, "系统配置不存在");
		}

		systemConfigPO.setGroup(systemConfigVO.getGroup());
		systemConfigPO.setValue(systemConfigVO.getValue());
		systemConfigPO.setComment(systemConfigVO.getComment());

		systemConfigDao.update(systemConfigPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSystemConfig(SystemConfigVO systemConfigVO, String userId) throws FLException {

		int company = systemConfigVO.getCompany() == null ? 0 : systemConfigVO.getCompany();

		// 同公司下同 key 唯一(历史全局唯一查询保留,避免与老数据冲突)
		SystemConfigPO existGlobal = systemConfigDao.querySystemConfig(systemConfigVO.getKey());

		SystemConfigPO existCompany = systemConfigDao.querySystemConfig(systemConfigVO.getKey(), company);

		if (existGlobal != null || existCompany != null) {
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}

		SystemConfigPO systemConfigPO = new SystemConfigPO();

		systemConfigPO.setGroup(systemConfigVO.getGroup());
		systemConfigPO.setKey(systemConfigVO.getKey());
		systemConfigPO.setValue(systemConfigVO.getValue());
		systemConfigPO.setCompany(company);

		systemConfigPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		systemConfigPO.setComment(systemConfigVO.getComment());

		systemConfigPO.setCreater((userDao.queryUserByUserId(userId)));

		systemConfigDao.save(systemConfigPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSystemConfig(SystemConfigVO systemConfigVO) throws FLException {

		SystemConfigPO systemConfigPO = systemConfigDao.get(systemConfigVO.getScid());

		if (systemConfigPO == null) {
			throw new FLException(130013, "系统配置不存在");
		}

		systemConfigDao.delete(systemConfigPO);

		return 0;
	}

}

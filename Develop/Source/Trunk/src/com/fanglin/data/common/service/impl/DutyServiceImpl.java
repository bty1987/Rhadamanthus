package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DutyDao;
import com.fanglin.data.common.service.DutyService;
import com.fanglin.data.common.vo.DutyVO;
import com.fanglin.data.po.DutyPO;

import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("dutyService")
@Transactional(readOnly = true)
public class DutyServiceImpl implements DutyService {
	@Autowired
	private DutyDao dutyDao;

	@Override
	public void pageDuty(Paging paging, List<Filter> filters) {
		List<DutyPO> dutyPOs = dutyDao.pageDuty(paging, filters);
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		for (DutyPO dutyPO : dutyPOs) {
			DutyVO dutyVO = new DutyVO();
			BeanUtil.copyProperties(dutyPO, dutyVO);
			dutyVOs.add(dutyVO);
		}
		paging.setData(dutyVOs);
	}

	@Override
	public List<DutyVO> queryDuty() {

		List<DutyPO> dutyPOs = dutyDao.queryDuty();
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		for (DutyPO dutyPO : dutyPOs) {
			DutyVO dutyVO = new DutyVO();

			BeanUtil.copyProperties(dutyPO, dutyVO);

			dutyVOs.add(dutyVO);
		}
		return dutyVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDuty(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.queryDutyByName(dutyVO.getName());
		if (dutyPO != null) {
			throw new FLException(130016, "职位已存在");
		}

		dutyPO = new DutyPO();
		BeanUtil.copyProperties(dutyVO, dutyPO);
		dutyDao.save(dutyPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDuty(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());
		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}
		DutyPO dutyPOs = dutyDao.queryDutyByName(dutyVO.getName());
		if (dutyPOs != null) {
			throw new FLException(130016, "职位已存在");
		}
		BeanUtil.copyProperties(dutyVO, dutyPO);
		dutyPO.setName(dutyVO.getName());
		dutyDao.update(dutyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDutyForStatus(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());
		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}
		BeanUtil.copyProperties(dutyVO, dutyPO);
		dutyPO.setStatus(dutyVO.getStatus());
		dutyDao.update(dutyPO);

		return 0;
	}
}

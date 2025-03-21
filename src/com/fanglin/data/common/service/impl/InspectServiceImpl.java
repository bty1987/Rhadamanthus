package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.InspectDao;
import com.fanglin.data.common.service.InspectService;
import com.fanglin.data.common.vo.InspectVO;
import com.fanglin.data.po.InspectPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("inspectService")
@Transactional(readOnly = true)
public class InspectServiceImpl implements InspectService {

	@Autowired
	private InspectDao inspectDao;

	@Override
	public void pageInspect(Paging paging, List<Filter> filters) {

		List<InspectPO> inspectPOs = inspectDao.pageInspect(paging, filters);
		List<InspectVO> inspectVOs = new ArrayList<InspectVO>();

		for (InspectPO inspectPO : inspectPOs) {

			InspectVO inspectVO = new InspectVO();

			BeanUtil.copyProperties(inspectPO, inspectVO);

			inspectVOs.add(inspectVO);
		}

		paging.setData(inspectVOs);

	}

	@Override
	public List<InspectVO> queryInspect(InspectVO inspect) {

		List<InspectPO> inspectPOs = inspectDao.queryInspect(inspect.getAtttype(), inspect.getType());
		List<InspectVO> inspectVOs = new ArrayList<InspectVO>();

		for (InspectPO inspectPO : inspectPOs) {

			InspectVO inspectVO = new InspectVO();

			BeanUtil.copyProperties(inspectPO, inspectVO);

			inspectVOs.add(inspectVO);
		}

		return inspectVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addInspect(InspectVO inspectVO, int company) {

		InspectPO inspectPO = new InspectPO();

		BeanUtil.copyProperties(inspectVO, inspectPO);

		inspectPO.setCompany(company);

		inspectDao.save(inspectPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateInspect(InspectVO inspectVO) throws FLException {

		InspectPO inspectPO = inspectDao.get(inspectVO.getIid());

		if (inspectPO == null) {
			throw new FLException(130132, "自检模板不存在");
		}

		BeanUtil.copyProperties(inspectVO, inspectPO, Arrays.asList("status"));

		inspectDao.update(inspectPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateInspectForStatus(InspectVO inspectVO) throws FLException {

		InspectPO inspectPO = inspectDao.get(inspectVO.getIid());

		if (inspectPO == null) {
			throw new FLException(130132, "自检模板不存在");
		}

		inspectPO.setStatus(inspectVO.getStatus());

		inspectDao.update(inspectPO);

	}
}

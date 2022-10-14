package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.FlowitemDao;
import com.fanglin.data.common.dao.FlowpathDao;
import com.fanglin.data.common.service.FlowpathService;
import com.fanglin.data.common.vo.FlowpathVO;
import com.fanglin.data.po.FlowpathPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("flowpathService")
@Transactional(readOnly = true)
public class FlowpathServiceImpl implements FlowpathService {

	@Autowired
	private FlowpathDao flowpathDao;

	@Autowired
	private FlowitemDao flowitemDao;

	@Override
	public void pageFlowpath(Paging paging, List<Filter> filters) {

		List<FlowpathPO> flowpathPOs = flowpathDao.pageFlowpath(paging, filters);
		List<FlowpathVO> flowpathVOs = new ArrayList<FlowpathVO>();

		for (FlowpathPO flowpathPO : flowpathPOs) {

			FlowpathVO flowpathVO = new FlowpathVO();

			BeanUtil.copyProperties(flowpathPO, flowpathVO);

			flowpathVOs.add(flowpathVO);
		}

		paging.setData(flowpathVOs);
	}

	@Override
	public List<FlowpathVO> queryFlowpath(FlowpathVO flowpathVO) {

		List<FlowpathPO> flowpathPOs = flowpathDao.queryFlowpath(flowpathVO.getFpid(), flowpathVO.getKeyword());
		List<FlowpathVO> flowpathVOs = new ArrayList<FlowpathVO>();

		for (FlowpathPO flowpathPO : flowpathPOs) {

			flowpathVO = new FlowpathVO();

			BeanUtil.copyProperties(flowpathPO, flowpathVO);

			flowpathVOs.add(flowpathVO);
		}

		return flowpathVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFlowpath(FlowpathVO flowpathVO) throws FLException {

		FlowpathPO flowpathPO = new FlowpathPO();

		BeanUtil.copyProperties(flowpathVO, flowpathPO);

		flowpathDao.save(flowpathPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFlowpath(FlowpathVO flowpathVO) throws FLException {

		FlowpathPO flowpathPO = flowpathDao.get(flowpathVO.getFpid());

		if (flowpathPO == null) {
			throw new FLException(130111, "流程不存在");
		}

		BeanUtil.copyProperties(flowpathVO, flowpathPO);

		flowpathDao.update(flowpathPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFlowpath(FlowpathVO flowpathVO) throws FLException {

		FlowpathPO flowpathPO = flowpathDao.get(flowpathVO.getFpid());

		if (flowpathPO == null) {
			throw new FLException(130111, "流程不存在");
		}

		flowitemDao.deleteFlowitem(flowpathVO.getFpid());
		flowpathDao.delete(flowpathPO);

		return 0;
	}
}

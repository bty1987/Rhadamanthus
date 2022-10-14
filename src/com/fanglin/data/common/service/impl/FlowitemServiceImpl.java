package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.FlowitemDao;
import com.fanglin.data.common.dao.FlowpathDao;
import com.fanglin.data.common.service.FlowitemService;
import com.fanglin.data.common.vo.FlowitemVO;
import com.fanglin.data.common.vo.FlowpathVO;
import com.fanglin.data.po.FlowitemPO;
import com.fanglin.data.po.FlowpathPO;
import com.fanglin.utils.BeanUtil;

@Service("flowitemService")
@Transactional(readOnly = true)
public class FlowitemServiceImpl implements FlowitemService {

	@Autowired
	private FlowitemDao flowitemDao;

	@Autowired
	private FlowpathDao flowpathDao;

	@Override
	public List<FlowitemVO> queryFlowitem(FlowitemVO flowitemVO) {

		List<FlowitemPO> flowitemPOs = flowitemDao.queryFlowitem(flowitemVO.getFpid());
		List<FlowitemVO> flowitemVOs = new ArrayList<FlowitemVO>();

		for (FlowitemPO flowitemPO : flowitemPOs) {

			flowitemVO = new FlowitemVO();

			BeanUtil.copyProperties(flowitemPO, flowitemVO);

			flowitemVOs.add(flowitemVO);
		}

		return flowitemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFlowitem(FlowpathVO flowpathVO, List<FlowitemVO> flowitemVOs) throws FLException {

		FlowpathPO flowpathPO = flowpathDao.get(flowpathVO.getFpid());

		if (flowpathPO == null) {
			throw new FLException(130111, "流程不存在");
		}

		flowitemDao.deleteFlowitem(flowpathPO.getFpid());

		for (FlowitemVO flowitemVO : flowitemVOs) {

			FlowitemPO flowitemPO = new FlowitemPO();

			BeanUtil.copyProperties(flowitemVO, flowitemPO);

			flowitemPO.setFpid(flowpathPO.getFpid());

			flowitemDao.save(flowitemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFlowItem(FlowitemVO flowitemVO) throws FLException {

		flowitemDao.deleteFlowitem(flowitemVO.getFpid());

		return 0;
	}

}

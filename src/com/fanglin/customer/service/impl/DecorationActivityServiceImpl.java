package com.fanglin.customer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.service.DecorationActivityService;
import com.fanglin.customer.vo.DecorationActivityVO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.po.DecorationActivityPO;

@Service("decorationActivityOrderService")
@Transactional(readOnly = true)
public class DecorationActivityServiceImpl implements DecorationActivityService {

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Override
	public DecorationActivityVO queryCusDecorationActivity(DecorationActivityVO decorationActivityVO) {

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(decorationActivityVO.getOrderId());
		decorationActivityVO = new DecorationActivityVO();

		StringBuffer activity = new StringBuffer();

		for (DecorationActivityPO decorationActivityPO : decorationActivityPOs) {

			activity.append(decorationActivityPO.getActivity().getName());
			activity.append(" ");
		}

		decorationActivityVO.setDecorationActivitys(activity.toString());

		return decorationActivityVO;
	}

}

package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CircleDao;
import com.fanglin.customer.dao.CircleDrawingDao;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.CircleDrawingPO;
import com.fanglin.customer.po.CirclePO;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.CircleService;
import com.fanglin.customer.vo.CircleDrawingVO;
import com.fanglin.customer.vo.CircleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("circleService")
@Transactional(readOnly = true)
public class CircleServiceImpl implements CircleService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CircleDao circleDao;

	@Autowired
	private CircleDrawingDao circleDrawingDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<CircleVO> queryDecorationCircle(List<CircleVO> circleVOs, List<CirclePO> circlePOs) {

		if (circlePOs != null && circlePOs.size() != 0) {

			for (CirclePO circlePO : circlePOs) {

				CircleVO circleVO = circlePO.ptv(true);

				circleVOs.add(circleVO);
			}
		}

		return circleVOs;
	}

	@Override
	public void pageCircleByUnionId(Paging paging, List<Filter> filters, String unionId) {

		List<DecorationPO> decorationPOs = decorationDao.queryCusDecoration(unionId);
		List<String> orderIds = new ArrayList<String>();

		for (DecorationPO decorationPO : decorationPOs) {
			orderIds.add(decorationPO.getOrderId());
		}

		List<CircleVO> circleVOs = new ArrayList<CircleVO>();

		if (orderIds.size() != 0) {

			List<CirclePO> circlePOs = circleDao.queryDecorationCircleByOrderIds(paging, filters, orderIds);

			circleVOs = queryDecorationCircle(circleVOs, circlePOs);
		}

		paging.setData(circleVOs);
	}

	@Override
	public void pageCircleByOrderId(Paging paging, List<Filter> filters, CircleVO circleVO) {

		List<CirclePO> circlePOs = circleDao.queryDecorationCircleByOrderId(paging, filters, circleVO.getOrderId());
		List<CircleVO> circleVOs = new ArrayList<CircleVO>();

		circleVOs = queryDecorationCircle(circleVOs, circlePOs);

		paging.setData(circleVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCircle(CircleVO circleVO, List<CircleDrawingVO> circleDrawingVOs, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(190005, "人员不存在");
		}

		CirclePO circlePO = new CirclePO(new UserPO());

		BeanUtil.copyPropertie(circleVO, circlePO, Arrays.asList("creater"));
		BeanUtil.copyPropertie(creater, circlePO.getCreater(), Arrays.asList("role", "duty", "dept"));

		circlePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		circlePO.setPraise(CirclePO.PRAISE_INIT_INTEGER);

		circleDao.save(circlePO);

		if (circleDrawingVOs != null && circleDrawingVOs.size() != 0) {

			for (CircleDrawingVO circleDrawingVO : circleDrawingVOs) {

				CircleDrawingPO circleDrawingPO = new CircleDrawingPO();

				circleDrawingPO.setCircle(circlePO);
				circleDrawingPO.setPath(circleDrawingVO.getPath());

				circleDrawingDao.save(circleDrawingPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCircleForPraise(CircleVO circleVO) throws FLException {

		CirclePO circlePO = circleDao.get(circleVO.getCid());

		if (circlePO != null) {

			int praise = Arith.add(circlePO.getPraise(), 1);
			circlePO.setPraise(praise);

			circleDao.update(circlePO);
		}

		return 0;
	}

}

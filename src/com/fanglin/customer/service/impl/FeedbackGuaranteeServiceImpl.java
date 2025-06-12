package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.FeedbackGuaranteeDao;
import com.fanglin.customer.po.FeedbackGuaranteePO;
import com.fanglin.customer.service.FeedbackGuaranteeService;
import com.fanglin.customer.vo.FeedbackGuaranteeVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("feedbackGuaranteeService")
@Transactional(readOnly = true)
public class FeedbackGuaranteeServiceImpl implements FeedbackGuaranteeService {

	@Autowired
	private FeedbackGuaranteeDao feedbackGuaranteeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<FeedbackGuaranteeVO> queryFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuarantee) {

		List<FeedbackGuaranteePO> feedbackGuaranteePOs = feedbackGuaranteeDao.queryFeedbackGuarantee(feedbackGuarantee.getFid());

		List<FeedbackGuaranteeVO> feedbackGuaranteeVOs = new ArrayList<FeedbackGuaranteeVO>();

		for (FeedbackGuaranteePO feedbackGuaranteePO : feedbackGuaranteePOs) {

			FeedbackGuaranteeVO feedbackGuaranteeVO = new FeedbackGuaranteeVO(new UserVO(), new UserVO());

			feedbackGuaranteePO.ptv(feedbackGuaranteeVO);

			feedbackGuaranteeVOs.add(feedbackGuaranteeVO);

		}

		return feedbackGuaranteeVOs;
	}

	@Override
	public FeedbackGuaranteeVO queryFeedbackGuaranteeByFgid(FeedbackGuaranteeVO feedbackGuarantee) {

		FeedbackGuaranteePO feedbackGuaranteePO = feedbackGuaranteeDao.get(feedbackGuarantee.getFgid());

		FeedbackGuaranteeVO feedbackGuaranteeVO = new FeedbackGuaranteeVO(new UserVO(), new UserVO());

		feedbackGuaranteePO.ptv(feedbackGuaranteeVO);

		return feedbackGuaranteeVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public long addFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuaranteeVO, String userId) throws FLException {

		FeedbackGuaranteePO feedbackGuaranteePO = new FeedbackGuaranteePO();

		BeanUtil.copyPropertie(feedbackGuaranteeVO, feedbackGuaranteePO, Arrays.asList("creater", "supervisor"));

		feedbackGuaranteePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		if (feedbackGuaranteeVO.getOrderId() != null) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(feedbackGuaranteeVO.getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "订单不存在");
			}

		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(190005, "人员不存在");
		}

		feedbackGuaranteePO.setCreater(creater);

		feedbackGuaranteeDao.save(feedbackGuaranteePO);

		return feedbackGuaranteePO.getFgid();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuaranteeVO) throws FLException {

		FeedbackGuaranteePO feedbackGuaranteePO = feedbackGuaranteeDao.get(feedbackGuaranteeVO.getFgid());

		feedbackGuaranteePO.setBids(feedbackGuaranteeVO.getBids());
		feedbackGuaranteePO.setBrands(feedbackGuaranteeVO.getBrands());
		feedbackGuaranteePO.setDeptType(feedbackGuaranteeVO.getDeptType());
		feedbackGuaranteePO.setPhone(feedbackGuaranteeVO.getPhone());
		feedbackGuaranteePO.setSource(feedbackGuaranteeVO.getSource());
		feedbackGuaranteePO.setCutomerType(feedbackGuaranteeVO.getCutomerType());
		feedbackGuaranteePO.setContent(feedbackGuaranteeVO.getContent());
		feedbackGuaranteePO.setWorkType(feedbackGuaranteeVO.getWorkType());
		feedbackGuaranteePO.setRenovationYear(feedbackGuaranteeVO.getRenovationYear());
		feedbackGuaranteePO.setReportedDate(feedbackGuaranteeVO.getReportedDate());
		feedbackGuaranteePO.setRepairResult(feedbackGuaranteeVO.getRepairResult());

		if (feedbackGuaranteeVO.getOrderId() != null) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(feedbackGuaranteeVO.getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "订单不存在");
			}

		}

		feedbackGuaranteeDao.update(feedbackGuaranteePO);

	}
}

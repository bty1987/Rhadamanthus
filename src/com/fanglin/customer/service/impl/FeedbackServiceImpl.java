package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.dao.FeedbackDrawingDao;
import com.fanglin.customer.po.FeedbackDrawingPO;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.customer.service.FeedbackService;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("feedbackService")
@Transactional(readOnly = true)
public class FeedbackServiceImpl implements FeedbackService {

	@Autowired
	private FeedbackDao feedbackDao;

	@Autowired
	private FeedbackDrawingDao feedbackDrawingDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageFeedback(Paging paging, List<Filter> filters, int company) throws FLException {

		List<FeedbackPO> feedbackPOs = feedbackDao.pageFeedback(paging, filters, company);
		List<FeedbackVO> feedbackVOs = new ArrayList<FeedbackVO>();

		for (FeedbackPO feedbackPO : feedbackPOs) {
			feedbackVOs.add(feedbackPO.ptv(new FeedbackVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(feedbackVOs);
	}

	@Override
	public void pageFeedbackByOrderId(Paging paging, List<Filter> filters) throws FLException {

		List<FeedbackPO> feedbackPOs = feedbackDao.pageFeedback(paging, filters, CompanyPO.TYPE_HEADQUARTER_INT);
		List<FeedbackVO> feedbackVOs = new ArrayList<FeedbackVO>();

		for (FeedbackPO feedbackPO : feedbackPOs) {
			feedbackVOs.add(feedbackPO.ptv(new FeedbackVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(feedbackVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFeedback(FeedbackVO feedbackVO) throws FLException {

		FeedbackPO feedbackPO = new FeedbackPO();

		BeanUtil.copyPropertie(feedbackVO, feedbackPO, Arrays.asList("company"));

		feedbackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		feedbackPO.setCompany(companyDao.get(CompanyPO.TYPE_HEADQUARTER_INT));

		if (feedbackVO.getOrderId() != null) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(feedbackVO.getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "装修单不存在");
			}

			feedbackPO.setCompany(new CompanyPO(decorationPO.getCompany()));
		}

		feedbackDao.save(feedbackPO);

		if (feedbackVO.getDrawings() != null && feedbackVO.getDrawings().size() != 0) {

			for (String drawing : feedbackVO.getDrawings()) {
				feedbackDrawingDao.save(new FeedbackDrawingPO(feedbackPO.getFid(), drawing));
			}
		}

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	public int receiveFeedback(FeedbackVO feedbackVO, Authentication authentication) throws FLException {

		FeedbackPO feedback = feedbackDao.get(feedbackVO.getFid());

		if (feedback == null) {
			throw new FLException(330053, "反馈信息不存在");
		}

		if (feedback.getStatus() != FeedbackPO.STATUS_INITIAL_INT) {
			throw new FLException(330054, "反馈状态不可操作");
		}

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		feedback.setReceiver(userPO);
		feedback.setStatus(FeedbackPO.STATUS_RECEIVE_INT);
		feedback.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		feedbackDao.update(feedback);

		return 0;
	}

	@Transactional(rollbackFor = Exception.class)
	public int finishFeedback(FeedbackVO feedbackVO, Authentication authentication) throws FLException {

		FeedbackPO feedback = feedbackDao.get(feedbackVO.getFid());

		if (feedback == null) {
			throw new FLException(330093, "反馈记录不存在");
		}

		if (feedback.getStatus() != FeedbackPO.STATUS_HANDLE_INT) {
			throw new FLException(330054, "反馈状态不可操作");
		}

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		feedback.setFinisher(userPO);
		feedback.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		feedback.setStatus(FeedbackPO.STATUS_FINISH_INT);

		feedbackDao.update(feedback);

		return 0;

	}
}

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
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.dao.FeedbackRecordDao;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.customer.po.FeedbackRecordPO;
import com.fanglin.customer.service.FeedbackRecordService;
import com.fanglin.customer.vo.FeedbackRecordVO;
import com.fanglin.customer.vo.FeedbackVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("feedbackRecordService")
@Transactional(readOnly = true)
public class FeedbackRecordServiceImpl implements FeedbackRecordService {

	@Autowired
	private FeedbackRecordDao feedbackRecordDao;

	@Autowired
	private FeedbackDao feedbackDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<FeedbackRecordVO> queryFeedbackRecord(FeedbackRecordVO feedbackRecord) {

		List<FeedbackRecordPO> feedbackRecordPOs = feedbackRecordDao.queryFeedbackRecord(feedbackRecord.getFeedback().getFid());
		List<FeedbackRecordVO> feedbackRecordVOs = new ArrayList<FeedbackRecordVO>();

		for (FeedbackRecordPO feedbackRecordPO : feedbackRecordPOs) {
			feedbackRecordVOs.add(feedbackRecordPO.ptv(new FeedbackRecordVO(new UserBaseVO(), new FeedbackVO())));
		}

		return feedbackRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFeedbackRecord(FeedbackRecordVO feedbackRecordVO, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();

		FeedbackPO feedbackPO = feedbackDao.get(feedbackRecordVO.getFeedback().getFid());

		if (feedbackPO == null) {
			throw new FLException(330053, "反馈信息不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		FeedbackRecordPO feedbackRecordPO = new FeedbackRecordPO();

		BeanUtil.copyPropertie(feedbackRecordVO, feedbackRecordPO, Arrays.asList("feedback", "handler"));

		feedbackRecordPO.setFeedback(feedbackPO);
		feedbackRecordPO.setHandler(userPO);
		feedbackRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		feedbackRecordDao.save(feedbackRecordPO);

		if (!Arrays.asList(FeedbackPO.STATUS_RECEIVE_INT, FeedbackPO.STATUS_HANDLE_INT).contains(feedbackPO.getStatus())) return 0;

		feedbackPO.setHandler(userPO);
		feedbackPO.setStatus(FeedbackPO.STATUS_HANDLE_INT);
		feedbackPO.setHandleTime(DateUtil.getDateToTimestamp(new Date()));

		feedbackDao.update(feedbackPO);

		return 0;
	}
}

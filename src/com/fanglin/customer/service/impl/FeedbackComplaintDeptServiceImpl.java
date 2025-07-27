package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.dao.FeedbackComplaintDao;
import com.fanglin.customer.dao.FeedbackComplaintDeptDao;
import com.fanglin.customer.po.FeedbackComplaintDeptPO;
import com.fanglin.customer.po.FeedbackComplaintPO;
import com.fanglin.customer.po.FeedbackComplaintProblemPO;
import com.fanglin.customer.service.FeedbackComplaintDeptService;
import com.fanglin.customer.vo.FeedbackComplaintDeptVO;
import com.fanglin.customer.vo.FeedbackComplaintProblemVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("feedbackComplaintDeptService")
@Transactional(readOnly = true)
public class FeedbackComplaintDeptServiceImpl implements FeedbackComplaintDeptService {

	@Autowired
	private FeedbackComplaintDeptDao feedbackComplaintDeptDao;

	@Autowired
	private FeedbackComplaintDao feedbackComplaintDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<FeedbackComplaintDeptVO> queryFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) {

		List<FeedbackComplaintDeptPO> feedbackComplaintDeptPOs = feedbackComplaintDeptDao.queryFeedbackComplaintDept(feedbackComplaintDept.getFcid());
		List<FeedbackComplaintDeptVO> feedbackComplaintDeptVOs = new ArrayList<FeedbackComplaintDeptVO>();

		for (FeedbackComplaintDeptPO feedbackComplaintDeptPO : feedbackComplaintDeptPOs) {
			feedbackComplaintDeptVOs.add(feedbackComplaintDeptPO.ptv(new FeedbackComplaintDeptVO(new DepartmentVO(), new DutyVO(), new UserVO(), new FeedbackComplaintProblemVO(), new FeedbackComplaintProblemVO(), new FeedbackComplaintProblemVO())));
		}

		return feedbackComplaintDeptVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept, Authentication authentication) throws FLException {

		FeedbackComplaintPO feedbackComplaintPO = feedbackComplaintDao.get(feedbackComplaintDept.getFcid());

		if (feedbackComplaintPO == null) {
			throw new FLException(330053, "反馈信息不存在");
		}

		DepartmentPO departmentPO = departmentDao.get(feedbackComplaintDept.getDept().getDid());

		UserPO dutyUser = userDao.queryUserByUserId(feedbackComplaintDept.getDutyUser().getUserId());

		if (dutyUser == null) {
			throw new FLException(190005, "人员不存在");
		}

		FeedbackComplaintDeptPO feedbackComplaintDeptPO = new FeedbackComplaintDeptPO();

		BeanUtil.copyPropertie(feedbackComplaintDept, feedbackComplaintDeptPO, Arrays.asList("dept", "duty", "dutyUser", "firstLevel", "secondary", "problemType"));

		feedbackComplaintDeptPO.setDutyUser(dutyUser);
		feedbackComplaintDeptPO.setDept(departmentPO);
		feedbackComplaintDeptPO.setDuty(new DutyPO(feedbackComplaintDept.getDuty().getDid()));
		feedbackComplaintDeptPO.setFirstLevel(new FeedbackComplaintProblemPO(feedbackComplaintDept.getFirstLevel().getFcpid()));
		feedbackComplaintDeptPO.setSecondary(new FeedbackComplaintProblemPO(feedbackComplaintDept.getSecondary().getFcpid()));
		feedbackComplaintDeptPO.setProblemType(new FeedbackComplaintProblemPO(feedbackComplaintDept.getProblemType().getFcpid()));

		feedbackComplaintDeptPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		feedbackComplaintDeptDao.save(feedbackComplaintDeptPO);

		feedbackComplaintDept.setFcdid(feedbackComplaintDeptPO.getFcdid());

		return 0;
	}

	@Override
	public int updateFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) {

		FeedbackComplaintDeptPO feedbackComplaintDeptPO = feedbackComplaintDeptDao.get(feedbackComplaintDept.getFcdid());

		BeanUtil.copyPropertie(feedbackComplaintDept, feedbackComplaintDeptPO, Arrays.asList("feedbackComplaint", "dept"));

		feedbackComplaintDeptDao.update(feedbackComplaintDeptPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) throws FLException {

		FeedbackComplaintDeptPO feedbackComplaintDeptPO = feedbackComplaintDeptDao.get(feedbackComplaintDept.getFcdid());

		if (feedbackComplaintDeptPO == null) {
			throw new FLException(330053, "反馈信息不存在");
		}

		feedbackComplaintDeptDao.delete(feedbackComplaintDeptPO);

		return 0;
	}
}

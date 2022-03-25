package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.ComplackDao;
import com.fanglin.customer.dao.ComplainDao;
import com.fanglin.customer.dao.ComplaintDao;
import com.fanglin.customer.po.ComplackPO;
import com.fanglin.customer.po.ComplainPO;
import com.fanglin.customer.po.ComplaintPO;
import com.fanglin.customer.service.ComplackService;
import com.fanglin.customer.vo.ComplackVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("complackService")
@Transactional(readOnly = true)
public class ComplackServiceImpl implements ComplackService {

	@Autowired
	private ComplackDao complackDao;

	@Autowired
	private ComplaintDao complaintDao;

	@Autowired
	private ComplainDao complainDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ComplackVO> queryComplack(ComplackVO complack) {

		List<ComplackPO> complackPOs = complackDao.queryComplack(complack.getCtid());

		List<ComplackVO> complackVOs = new ArrayList<ComplackVO>();

		ComplackVO complackVO;

		for (ComplackPO complackPO : complackPOs) {

			complackVO = new ComplackVO(new UserBaseVO());

			BeanUtil.copyProperties(complackPO, complackVO, Arrays.asList("operater"));
			BeanUtil.copyProperties(complackPO.getOperater(), complackVO.getOperater(), Arrays.asList("duty", "dept"));

			complackVOs.add(complackVO);
		}

		return complackVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int trackComplack(ComplackVO Complack, String userId) throws FLException {

		ComplaintPO complaint = complaintDao.get(Complack.getCtid());
		ComplainPO complain = complainDao.get(Complack.getCid());

		UserPO user = userDao.queryUserByUserId(userId);

		if (complaint == null) {
			throw new FLException(330042, "投诉内容不存在");
		}

		complain.setUpdater(user);
		complain.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		complain.setStatus(ComplainPO.STATUS_DISPOSE_SHORT);

		complainDao.update(complain);

		complaint.setUpdater(user);
		complaint.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		complaint.setStatus(ComplaintPO.STATUS_DISPOSE_SHORT);

		complaintDao.update(complaint);

		ComplackPO complackPO = new ComplackPO();

		complackPO.setCid(Complack.getCid());
		complackPO.setCtid(Complack.getCtid());
		complackPO.setOperater(user);
		complackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		complackPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		complackPO.setComment(Complack.getComment());

		complackDao.save(complackPO);

		return 0;
	}

}

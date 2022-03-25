package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.ComplaintDao;
import com.fanglin.customer.po.ComplaintPO;
import com.fanglin.customer.service.ComplaintService;
import com.fanglin.customer.vo.ComplaintVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("complaintService")
@Transactional(readOnly = true)
public class ComplaintServiceImpl implements ComplaintService {

	@Autowired
	private ComplaintDao complaintDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private DepartmentDao deptDao;

	@Override
	public List<ComplaintVO> queryComplaint(ComplaintVO complaint) {

		List<ComplaintPO> complaintPOs = complaintDao.queryComplaint(complaint.getCid());

		List<ComplaintVO> complaintVOs = new ArrayList<ComplaintVO>();

		ComplaintVO complaintVO;

		for (ComplaintPO complaintPO : complaintPOs) {

			complaintVO = new ComplaintVO(new DepartmentVO(), new UserBaseVO(), new BrandVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(complaintPO, complaintVO, Arrays.asList("dept", "staff", "brand", "creater", "updater"));
			BeanUtil.copyProperties(complaintPO.getBrand(), complaintVO.getBrand(), Arrays.asList("supplier"));
			BeanUtil.copyProperties(complaintPO.getDept(), complaintVO.getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(complaintPO.getStaff(), complaintVO.getStaff(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(complaintPO.getCreater(), complaintVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(complaintPO.getUpdater(), complaintVO.getUpdater(), Arrays.asList("duty", "dept"));

			complaintVOs.add(complaintVO);
		}

		return complaintVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addComplaint(ComplaintVO complaint, String UserId) throws FLException {

		ComplaintPO complaintPO = new ComplaintPO();

		UserPO creater = userDao.queryUserByUserId(UserId);
		DepartmentPO dept = deptDao.get(complaint.getDept().getDid());
		UserPO staff = userDao.get(complaint.getStaff().getUid());
		BrandPO brand = brandDao.get(complaint.getBrand().getBid());

		complaintPO.setCid(complaint.getCid());
		complaintPO.setType(complaint.getType());
		complaintPO.setDept(dept);
		complaintPO.setBrand(brand);
		complaintPO.setStaff(staff);
		complaintPO.setCreater(creater);
		complaintPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		complaintPO.setContent(complaint.getContent());

		complaintDao.save(complaintPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishComplaint(ComplaintVO complaint, String UserId) throws FLException {

		ComplaintPO complaintPO = complaintDao.get(complaint.getCtid());

		if (complaintPO == null) {
			throw new FLException(330042, "投诉内容不存在");
		}

		if (complaintPO.getStatus() != ComplaintPO.STATUS_DISPOSE_SHORT) {
			throw new FLException(330043, "投诉内容不可操作");
		}

		UserPO updater = userDao.queryUserByUserId(UserId);

		complaintPO.setUpdater(updater);
		complaintPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		complaintPO.setStatus(ComplaintPO.STATUS_END_SHORT);

		complaintDao.update(complaintPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int closeComplaint(ComplaintVO complaint, String UserId) throws FLException {

		ComplaintPO complaintPO = complaintDao.get(complaint.getCtid());

		if (complaintPO == null) {
			throw new FLException(330042, "投诉内容不存在");
		}

		if (complaintPO.getStatus() != ComplaintPO.STATUS_END_SHORT) {
			throw new FLException(330043, "投诉内容不可操作");
		}

		complaintPO.setStatus(ComplaintPO.STATUS_CLOSE_SHORT);

		complaintDao.update(complaintPO);

		return 0;
	}

}

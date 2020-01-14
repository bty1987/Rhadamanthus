/**
 * Title: DepartmentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.service.DepartmentService;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("departmentService")
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageDepartment(Paging paging, List<Filter> filters, DepartmentVO departmentVO, int company) throws FLException {
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		if (departmentVO != null && departmentVO.getType() != null) {
			filters.add(new Filter("type", String.valueOf(departmentVO.getType().getDtid()), "eq"));
		}

		List<DepartmentPO> departmentPOs = departmentDao.pageDepartment(paging, filters, company);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();

		for (DepartmentPO departmentPO : departmentPOs) {

			departmentVOs.add(convertBean(departmentPO));
		}

		paging.setData(departmentVOs);
	}

	@Override
	public List<DepartmentVO> queryDepartment(DepartmentVO departmentVO, Integer company) throws FLException {

		List<DepartmentPO> departmentPOs;

		if (departmentVO != null && departmentVO.getType() != null) {
			String name = departmentVO.getType().getName();
			int dtid = departmentVO.getType().getDtid();
			if (name != null && !name.equals("")) {
				departmentPOs = departmentDao.queryDepartment(departmentTypeDao.queryDepartmentTypeByName(name).getDtid(), company);
			} else {
				departmentPOs = departmentDao.queryDepartment(dtid, company);
			}
		} else {
			departmentPOs = departmentDao.queryDepartment(0, company);
		}

		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();

		Map<Integer, Integer> companys = new HashMap<Integer, Integer>();

		for (DepartmentPO departmentPO : departmentPOs) {

			company = companys.get(departmentPO.getCompany());

			if (company == null) {
				company = Integer.parseInt(FormatUtil.encodeCompany(departmentPO.getCompany()));
				companys.put(departmentPO.getCompany(), company);
			}

			departmentVO = convertBean(departmentPO);

			departmentVOs.add(departmentVO);
		}

		return departmentVOs;
	}

	@Override
	public List<DepartmentVO> queryDepartmentByDtid(DepartmentVO departmentVO, int company) {

		List<DepartmentPO> departmentPOs = departmentDao.queryDepartmentBytype(departmentVO.getType().getDtid(), company);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();

		for (DepartmentPO departmentPO : departmentPOs) {
			departmentVO = convertBean(departmentPO);

			departmentVOs.add(departmentVO);
		}

		return departmentVOs;
	}

	@Override
	public DepartmentVO queryDepartmentByDid(DepartmentVO dept) {
		DepartmentPO departmentPO = departmentDao.get(dept.getDid());
		DepartmentVO departmentVO = null;

		if (departmentPO != null) {
			departmentVO = convertBean(departmentPO);
		}

		return departmentVO;
	}

	@Override
	public DepartmentVO queryDepartmentByNo(DepartmentVO dept) {

		DepartmentPO departmentPO = departmentDao.queryDepartmentByNo(dept.getNo());

		DepartmentVO departmentVO = null;

		if (departmentPO != null) {
			departmentVO = convertBean(departmentPO);
		}

		return departmentVO;
	}

	@Override
	public List<DepartmentVO> queryDepartmentByName(DepartmentVO departmentVO, int company) {

		List<DepartmentPO> departmentPOs = departmentDao.pageDepartmentByName(new Paging(0, 10), departmentVO.getName(), company, departmentVO.getType().getDtid());
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();

		for (DepartmentPO departmentPO : departmentPOs) {
			departmentVOs.add(convertBean(departmentPO));
		}

		return departmentVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addDepartment(DepartmentVO departmentVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		UserPO userPO = null;
		if (departmentVO.getManager() != null && departmentVO.getManager().getUserId() != null) {
			userPO = userDao.queryUserByUserId(departmentVO.getManager().getUserId());
		}

		DepartmentPO departmentPO = new DepartmentPO();

		int count = countingService.queryCountingByTypeDate(DepartmentPO.IDENT_NUM_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		departmentPO.setNo(String.format("%sD_%s", companyPO.getShortname(), FormatUtil.fillZero(count, "000")));

		BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("dId", "no", "fatherDept", "type", "company", "manager"));

		if (departmentVO.getType() != null) {
			departmentPO.setType(departmentTypeDao.get(departmentVO.getType().getDtid()));
		}

		if (departmentVO.getFatherDept().getDid() != null) {
			departmentPO.setFatherDept(departmentDao.get(departmentVO.getFatherDept().getDid()));
		}

		departmentPO.setStatus(DepartmentPO.STATUS_ENABLE_INT);
		departmentPO.setCompany(company);
		departmentPO.setCreateTime(DateUtil.current());

		if (userPO != null) {
			departmentPO.setManager(userPO);
		}

		List<String> pinyins = PinYin4Util.getPinyin(departmentVO.getName());
		departmentPO.setPinyin(pinyins.get(0));

		departmentDao.save(departmentPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDepartment(DepartmentVO departmentVO) throws FLException {

		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDid());

		if (departmentPO == null) {
			throw new FLException(310001, "部门不存在");
		}

		UserPO userPO = null;
		if (departmentVO.getManager() != null && departmentVO.getManager().getUserId() != "") {
			userPO = userDao.queryUserByUserId(departmentVO.getManager().getUserId());
		}

		BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("no", "fatherDept", "type", "company", "status", "manager"));

		if (departmentVO.getType() != null) {
			departmentPO.setType(departmentTypeDao.get(departmentVO.getType().getDtid()));
		}

		if (departmentVO.getFatherDept().getDid() != null) {
			departmentPO.setFatherDept(departmentDao.get(departmentVO.getFatherDept().getDid()));
		}

		List<String> pinyins = PinYin4Util.getPinyin(departmentVO.getName());
		departmentPO.setPinyin(pinyins.get(0));

		if (userPO != null) {
			departmentPO.setManager(userPO);
		}

		departmentDao.update(departmentPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDepartmentForStatus(DepartmentVO departmentVO) throws FLException {

		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDid());

		if (departmentPO == null) {
			throw new FLException(310001, "部门不存在");
		}

		departmentPO.setStatus(departmentVO.getStatus());

		departmentDao.update(departmentPO);
	}

	public DepartmentVO convertBean(DepartmentPO departmentPO) {

		DepartmentVO departmentVO = new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO());

		BeanUtil.copyProperties(departmentPO, departmentVO, Arrays.asList("fatherDept", "type", "manager"));

		if (departmentPO.getType() != null) {
			BeanUtil.copyProperties(departmentPO.getType(), departmentVO.getType());
		}

		if (departmentPO.getFatherDept() != null) {
			BeanUtil.copyProperties(departmentPO.getFatherDept(), departmentVO.getFatherDept(), Arrays.asList("fatherDept", "cityProper", "type", "manager"));
		}

		if (departmentPO.getManager() != null && departmentPO.getManager().getUid() != 0) {
			BeanUtil.copyProperties(departmentPO.getManager(), departmentVO.getManager(), Arrays.asList("role", "dept", "duty"));
		}

		return departmentVO;

	}

}

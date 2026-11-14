package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.dao.WorkerDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.personel.service.WorkerService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("workerService")
@Transactional(readOnly = true)
public class WorkerServiceImpl implements WorkerService {

	@Autowired
	private WorkerDao workerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private UserInfoDao userInfoDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageWorker(Paging paging, List<Filter> filters, int company) throws FLException {

		List<UserPO> workerPOs = workerDao.pageWorker(paging, filters, company);
		List<UserVO> workerVOs = new ArrayList<UserVO>();

		for (UserPO workerPO : workerPOs) {
			workerVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(workerPO));
		}

		paging.setData(workerVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorker(UserVO workerVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("workerlimit", company);

		if (workerDao.countWorkerByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
			throw new FLException(190008, "人员数已达上限");
		}

		UserPO workerPO = new UserPO();

		DepartmentPO departmentPO = departmentDao.get(workerVO.getDept().getDid());

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		SystemConfigPO worker = systemConfigDao.querySystemConfig("worker"); // 游客角色ID

		if (worker == null) {
			throw new FLException(230010, "角色不存在");
		}

		BeanUtil.copyProperties(workerVO, workerPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_WORKER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sW-", companyPO.getShortname()) : "W-");
		no.append(FormatUtil.fillZero(count, "00000"));

		workerPO.setUserId(no.toString());
		workerPO.setLoginId(workerVO.getLoginId());
		workerPO.setCurrentName(workerVO.getUserName());

		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);

		workerPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));

		workerPO.setRole(new RolePO(Integer.valueOf(worker.getValue())));
		workerPO.setDuty(new DutyPO(workerVO.getDuty().getDid()));
		workerPO.setDept(departmentPO);

		workerPO.setCompany(company);

		workerPO.setPinYin(PinYin4Util.getPinyin(workerVO.getCurrentName()).get(0));

		workerPO.setIsLogin(UserPO.ISLOGIN_FIP_INT);
		workerPO.setType(UserPO.TYPE_WORKER_INT);

		workerDao.save(workerPO);

		UserPO operator = userDao.queryUserByUserId(userId);

		userRoleDao.save(new UserRolePO(workerPO.getUid(), workerPO.getRole(), operator));

		workerVO.setUid(workerPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		userInfoPO.setSalary("0");
		userInfoPO.setUser(workerPO);

		userInfoDao.save(userInfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateWorker(UserVO workerVO) throws FLException {

		UserPO workerPO = workerDao.get(workerVO.getUid());

		if (workerPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		workerPO.setUserName(workerVO.getUserName());
		workerPO.setCurrentName(workerVO.getCurrentName());
		workerPO.setPhone(workerVO.getPhone());
		workerPO.setOldUserId(workerVO.getOldUserId());

		workerDao.update(workerPO);
	}

}

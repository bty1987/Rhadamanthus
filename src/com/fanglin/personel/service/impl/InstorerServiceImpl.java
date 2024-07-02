/**
 * @File Name		: InstorerServiceImpl.java
 * @Package   	: com.fanglin.personel.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.personel.dao.InstorerDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserInfoDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserInfoPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.personel.service.InstorerService;
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

@Service("instorerService")
@Transactional(readOnly = true)
public class InstorerServiceImpl implements InstorerService {

	@Autowired
	private InstorerDao instorerDao;

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
	public void pageInstorer(Paging paging, List<Filter> filters, int company) throws FLException {

		List<UserPO> instorerPOs = instorerDao.pageInstorer(paging, filters, company);
		List<UserVO> instorerVOs = new ArrayList<UserVO>();

		for (UserPO instorerPO : instorerPOs) {
			instorerVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(instorerPO));
		}

		paging.setData(instorerVOs);
	}

	@Override
	public List<UserVO> queryInstorerByPinyin(String pinyin, int company) throws FLException {

		List<UserVO> instorerVOs = new ArrayList<UserVO>();
		List<UserPO> instorerPOs = instorerDao.queryInstorerByPinyin(pinyin, company);

		for (UserPO instorerPO : instorerPOs) {
			instorerVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(instorerPO));
		}

		return instorerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addInstorer(UserVO instorerVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SystemConfigPO userlimit = systemConfigDao.querySystemConfig("instorerlimit", company);

		if (instorerDao.countInstorerByCompany(company) >= (userlimit == null ? 100 : Integer.valueOf(userlimit.getValue()))) {
			throw new FLException(190008, "人员数已达上限");
		}

		UserPO instorerPO = new UserPO();

		DepartmentPO departmentPO = departmentDao.get(instorerVO.getDept().getDid());

		if (departmentPO.getFatherDept() == null) {
			throw new FLException(310002, "部门不可添加人员");
		}

		SystemConfigPO instorer = systemConfigDao.querySystemConfig("instorer"); // 游客角色ID

		if (instorer == null) {
			throw new FLException(230010, "角色不存在");
		}

		BeanUtil.copyProperties(instorerVO, instorerPO, Arrays.asList("role", "dept", "duty", "uId", "userId", "loginId", "password", "role", "isLogin", "company", "extranet"));

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INSTORER_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		StringBuffer no = new StringBuffer();
		no.append(SystemConfig.getInt("multicompany", 0) != 0 ? String.format("%sU-", companyPO.getShortname()) : "IM-");
		no.append(FormatUtil.fillZero(count, "00000"));

		instorerPO.setUserId(no.toString());
		instorerPO.setLoginId(instorerVO.getLoginId());
		instorerPO.setCurrentName(instorerVO.getUserName());

		SystemConfigPO password = systemConfigDao.querySystemConfig("password", company);

		instorerPO.setPassword(MD5Helper.MD5(password == null ? "helloworld" : password.getValue()));

		instorerPO.setRole(new RolePO(Integer.valueOf(instorer.getValue())));
		instorerPO.setDuty(new DutyPO(instorerVO.getDuty().getDid()));
		instorerPO.setDept(departmentPO);

		instorerPO.setCompany(company);

		instorerPO.setPinYin(PinYin4Util.getPinyin(instorerVO.getCurrentName()).get(0));

		instorerPO.setIsLogin(UserPO.ISLOGIN_FIP_INT);
		instorerPO.setType(UserPO.TYPE_INSTORER_INT);

		instorerDao.save(instorerPO);

		UserPO operator = userDao.queryUserByUserId(userId);

		userRoleDao.save(new UserRolePO(instorerPO.getUid(), instorerPO.getRole(), operator));

		instorerVO.setUid(instorerPO.getUid());

		UserInfoPO userInfoPO = new UserInfoPO();

		userInfoPO.setSalary("0");
		userInfoPO.setUser(instorerPO);

		userInfoDao.save(userInfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateInstorer(UserVO instorer) throws FLException {

		UserPO instorerPO = instorerDao.get(instorer.getUid());

		if (instorerPO == null) {
			throw new FLException(190012, "厂商不存在");
		}

		instorerPO.setUserName(instorer.getUserName());
		instorerPO.setCurrentName(instorer.getCurrentName());
		instorerPO.setPhone(instorer.getPhone());
		instorerPO.setOldUserId(instorer.getOldUserId());

		instorerDao.update(instorerPO);
	}

}

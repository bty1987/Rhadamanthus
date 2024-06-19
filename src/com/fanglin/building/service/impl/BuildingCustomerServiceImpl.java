package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.BuildingCustomerDao;
import com.fanglin.building.dao.BuildingDao;
import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.building.po.BuildingPO;
import com.fanglin.building.service.BuildingCustomerService;
import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("buildingCustomerService")
@Transactional(readOnly = true)
public class BuildingCustomerServiceImpl implements BuildingCustomerService {

	@Autowired
	private BuildingCustomerDao buildingCustomerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BuildingDao buildingDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageBuildingCustomer(Paging paging, List<Filter> filters, String userId) {

		UserPO user = userDao.queryUserByUserId(userId);

		List<BuildingCustomerPO> buildingCustomerPOs = buildingCustomerDao.pageBuildingCustomer(paging, filters, user.getUid());
		List<BuildingCustomerVO> buildingCustomerVOs = new ArrayList<BuildingCustomerVO>();

		for (BuildingCustomerPO buildingCustomerPO : buildingCustomerPOs) {
			buildingCustomerVOs.add(buildingCustomerPOToVO(buildingCustomerPO));
		}

		paging.setData(buildingCustomerVOs);
	}

	@Override
	public BuildingCustomerVO queryBuildingCustomerByCsid(BuildingCustomerVO buildingCustomer) {

		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.get(buildingCustomer.getCsid());

		BuildingCustomerVO buildingCustomerVO = buildingCustomerPOToVO(buildingCustomerPO);

		return buildingCustomerVO;
	}

	@Override
	public BuildingCustomerVO queryBuildingCustomerByNo(BuildingCustomerVO buildingCustomer) throws FLException {

		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.queryBuildingCustomerByNo(buildingCustomer.getNo());

		if (buildingCustomerPO == null) {
			throw new FLException(320008, "客源不存在");
		}

		BuildingCustomerVO buildingCustomerVO = buildingCustomerPOToVO(buildingCustomerPO);

		return buildingCustomerVO;
	}

	@Override
	public BuildingCustomerVO checkBuildingCustomer(BuildingCustomerVO buildingCustomer) throws FLException {

		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.checkBuildingCustomer(buildingCustomer.getCustomer().getCid(), buildingCustomer.getType());

		if (buildingCustomerPO == null) {
			throw new FLException(320008, "客源不存在");
		}

		BuildingCustomerVO buildingCustomerVO = buildingCustomerPOToVO(buildingCustomerPO);

		return buildingCustomerVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBuildingCustomer(BuildingCustomerVO buildingCustomerVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		Integer buildingCustomerCount = buildingCustomerDao.countBuildingCustomer(buildingCustomerVO.getCustomer().getCid(), buildingCustomerVO.getType());

		if (buildingCustomerCount > 0) {
			throw new FLException(320007, "客源已存在");
		}

		UserPO createPO = userDao.queryUserByUserId(userId);
		CustomerPO customerPO = customerDao.get(buildingCustomerVO.getCustomer().getCid());

		BuildingCustomerPO buildingCustomerPO = new BuildingCustomerPO(customerPO, createPO);
		BeanUtil.copyProperties(buildingCustomerVO, buildingCustomerPO, Arrays.asList("customer", "create"));

		buildingCustomerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		buildingCustomerPO.setStatus(BuildingCustomerPO.STATUS_INIT_SHORT);

		// NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

		String no = companyPO.getShortname() + "C" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		buildingCustomerPO.setNo(no);

		buildingCustomerDao.save(buildingCustomerPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingCustomer(BuildingCustomerVO buildingCustomerVO) throws FLException {

		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.get(buildingCustomerVO.getCsid());

		if (buildingCustomerPO == null) {
			throw new FLException(320008, "客源不存在");
		}

		if (buildingCustomerPO.getStatus() == 2) {
			throw new FLException(320009, "客源状态不可操作");
		}

		BeanUtil.copyProperties(buildingCustomerVO, buildingCustomerPO, Arrays.asList("customer", "create"));

		buildingCustomerDao.update(buildingCustomerPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBuildingCustomerForStatus(BuildingCustomerVO buildingCustomerVO) throws FLException {

		BuildingCustomerPO buildingCustomerPO = buildingCustomerDao.get(buildingCustomerVO.getCsid());

		if (buildingCustomerPO == null) {
			throw new FLException(320008, "客源不存在");
		}

		if (buildingCustomerPO.getStatus() == 2) {
			throw new FLException(320009, "客源状态不可操作");
		}

		if (buildingCustomerVO.getStatus() == 0) {
			BuildingPO buildingPO = buildingDao.queryBuildingByCsid(buildingCustomerVO.getCsid());

			if (buildingPO != null) {
				throw new FLException(320009, "客源状态不可操作");
			}
		}

		buildingCustomerPO.setStatus(buildingCustomerVO.getStatus());

		buildingCustomerDao.update(buildingCustomerPO);

	}

	public BuildingCustomerVO buildingCustomerPOToVO(BuildingCustomerPO buildingCustomerPO) {

		BuildingCustomerVO buildingCustomerVO = new BuildingCustomerVO(new CustomerVO(), new UserBaseVO());

		BeanUtil.copyProperties(buildingCustomerPO, buildingCustomerVO, Arrays.asList("customer", "create"));
		BeanUtil.copyProperties(buildingCustomerPO.getCustomer(), buildingCustomerVO.getCustomer());

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(buildingCustomerPO.getCustomer().getCid(), BuildingCustomerPO.STATUS_INIT_SHORT);

		if (customerPhones.size() > 0) {
			buildingCustomerVO.getCustomer().setPhone(customerPhones.get(0).getPhone());
		}

		BeanUtil.copyProperties(buildingCustomerPO.getCreate(), buildingCustomerVO.getCreate(), Arrays.asList("dept", "duty"));

		return buildingCustomerVO;
	}

}

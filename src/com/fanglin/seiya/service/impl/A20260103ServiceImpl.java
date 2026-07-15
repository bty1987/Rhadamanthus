/**
 * @File Name     : A20260103ServiceImpl.java
 * @Package       : com.fanglin.seiya.service.impl
 * @Version       : 1.0
 * @Date          : 2026-01-03
 * @Copyright     : Copyright Creators 2026
 * @Author        : Fanglin ERP Team
 * @Email         : support@fanglin.com
 * @Describing    : 2026-01-03 接口服务层实现 - 客户线索接入
 */

package com.fanglin.seiya.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.service.HouseService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.seiya.service.A20260103Service;

@Service("A20260103Service")
@Transactional(readOnly = true)
public class A20260103ServiceImpl implements A20260103Service {

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private HouseService houseService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private UserDao userDao;

	@Override
	public CustomerChanceVO queryCustomerChanceByCno(String cno) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChanceByCno(cno);

		if (customerChancePO == null) {
			throw new FLException(330075, "客户线索不存在");
		}

		CustomerChanceVO customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO()), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

		customerChancePO.ptv(customerChanceVO);

		if (customerChancePO.getCustomer() != null) {
			customerChanceVO.getSource().setPhone(customerChancePO.getCustomer().getPhone());
		}

		return customerChanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerLead(String leadCode, String village, String houseNumber, Integer buildArea, String phone, String name, String referOrderId, String sourceInfo, String contactInfo, String userId, Integer orgId, String salesmanId) throws FLException {

		// 参数必填验证 - 线索编号必填
		if (leadCode == null || leadCode.trim().isEmpty()) {
			throw new FLException(400001, "线索编号不能为空");
		}

		// 验证楼盘+楼号必须同时存在
		if ((village != null && !village.trim().isEmpty()) || (houseNumber != null && !houseNumber.trim().isEmpty())) {
			if (village == null || village.trim().isEmpty() || houseNumber == null || houseNumber.trim().isEmpty()) {
				throw new FLException(400002, "楼盘和楼号必须同时提供");
			}
		}

		// 通过线索编号查询现有客户机会
		CustomerChanceVO existingChance = queryCustomerChanceByCno(leadCode);

		// 获取操作人PO（用于记录CustomerSourceRecord）
		UserPO operater = userDao.queryUserByUserId(userId);

		// 获取现有CustomerSourcePO（用于比较旧值）
		long csid = existingChance.getSource().getCsid();
		long ccid = existingChance.getCcid();
		CustomerSourcePO sourcePO = customerSourceDao.get(csid);
		CustomerChancePO chancePO = customerChanceDao.queryCustomerChanceByCno(leadCode);

		// 验证客户机会状态 - 失效、完成、已结束状态不可操作
		if (chancePO != null && Arrays.asList(CustomerChancePO.STATUS_DISABLE_INT, CustomerChancePO.STATUS_COMPLETE_INT, CustomerChancePO.STATUS_FINISH_INT).contains(chancePO.getStatus())) {
			throw new FLException(330077, "客户机会不可操作");
		}

		// 处理房屋信息（楼盘+楼号）
		HouseVO houseVO = null;
		if (village != null && !village.trim().isEmpty() && houseNumber != null && !houseNumber.trim().isEmpty()) {
			VillageVO villageVO = new VillageVO(village);

			// 查询房屋是否存在
			houseVO = findHouse(village, houseNumber, orgId);

			// 不存在则创建
			if (houseVO == null || houseVO.getHid() == null) {
				houseVO = new HouseVO();
				houseVO.setVillage(villageVO);
				houseVO.setHouseNumber(houseNumber);
				if (buildArea != null) {
					houseVO.setBuildArea(buildArea);
				}
				houseService.existHouse(houseVO, orgId);
			}
		}

		// 处理客户信息（通过电话）
		CustomerVO customerVO = null;
		if (phone != null && !phone.trim().isEmpty()) {
			// 通过电话查询客户
			CustomerVO foundCustomer = findCustomerByPhone(phone, orgId);

			if (foundCustomer != null && foundCustomer.getCid() != null) {
				// 客户存在，使用现有客户
				customerVO = new CustomerVO();
				customerVO.setCid(foundCustomer.getCid());
			} else {
				// 客户不存在，创建新客户
				customerVO = new CustomerVO();
				customerVO.setName(name != null ? name : "未知客户");
				customerVO.setPhone(phone);
				customerService.existCustomer(customerVO, orgId);
			}
		}

		// 更新房屋（source + chance）
		if (houseVO != null && houseVO.getHid() != null) {
			String oldVillageName = sourcePO.getVillage() != null ? sourcePO.getVillage().getName() : "";
			String oldHouseNumber = sourcePO.getHouseNumber() != null ? sourcePO.getHouseNumber() : "";

			HousePO housePO = houseDao.get(houseVO.getHid());
			if (housePO != null) {
				sourcePO.setHouse(housePO);
				sourcePO.setVillage(housePO.getVillage());
				sourcePO.setHouseNumber(housePO.getHouseNumber());
				customerSourceDao.save(sourcePO);
			}

			if (chancePO != null && housePO != null) {
				chancePO.setHouse(housePO);
				customerChanceDao.save(chancePO);
			}

			if (!String.valueOf(houseVO.getHid()).equals(String.valueOf(existingChance.getHouse().getHid()))) {
				String newVillageName = housePO != null && housePO.getVillage() != null ? housePO.getVillage().getName() : village;
				customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("Seiya更新房屋,原楼盘:%s,原楼号:%s,新楼盘:%s,新楼号:%s", oldVillageName, oldHouseNumber, newVillageName, houseNumber), CustomerSourceRecordPO.TYPE_COMMON_INT, operater));
			}
		}

		// 更新客户（source + chance）
		if (customerVO != null && customerVO.getCid() != null) {
			String oldPhone = sourcePO.getPhone() != null ? sourcePO.getPhone() : "";
			String oldCustomerName = sourcePO.getCustomer() != null ? sourcePO.getCustomer().getName() : "";

			CustomerPO customerPO = customerDao.get(customerVO.getCid());
			if (customerPO != null) {
				sourcePO.setCustomer(customerPO);
				sourcePO.setPhone(SensitiveDataHelper.encrypt(phone));
				customerSourceDao.save(sourcePO);
			}

			if (chancePO != null && customerPO != null) {
				chancePO.setCustomer(customerPO);
				customerChanceDao.save(chancePO);
			}

			if (!String.valueOf(customerVO.getCid()).equals(String.valueOf(existingChance.getCustomer().getCid()))) {
				customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("Seiya更新客户,原客户:%s,原电话:%s,新电话:%s", oldCustomerName, oldPhone, phone), CustomerSourceRecordPO.TYPE_COMMON_INT, operater));
			}
		}

		// 更新referOrderId、source、contact（通过DAO直接更新）
		if (referOrderId != null || sourceInfo != null || contactInfo != null) {
			if (sourcePO != null) {
				if (referOrderId != null && !referOrderId.trim().isEmpty()) {
					String oldReferOrderId = sourcePO.getReferOrderId();
					sourcePO.setReferOrderId(referOrderId);
					customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("referOrderId: %s -> %s", oldReferOrderId, referOrderId), CustomerSourceRecordPO.TYPE_REFER_INT, operater));
				}
				if (sourceInfo != null && !sourceInfo.trim().isEmpty()) {
					String oldSourceInfo = sourcePO.getSource() != null ? sourcePO.getSource() : "";
					if (!oldSourceInfo.equals(sourceInfo)) {
						sourcePO.setSource(sourceInfo);
						customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("Seiya更新来源,原来源:%s,新来源:%s", oldSourceInfo, sourceInfo), CustomerSourceRecordPO.TYPE_COMMON_INT, operater));
					}
				}
				if (contactInfo != null && !contactInfo.trim().isEmpty()) {
					String oldContactInfo = sourcePO.getContact() != null ? sourcePO.getContact() : "";
					if (!oldContactInfo.equals(contactInfo)) {
						sourcePO.setContact(contactInfo);
						customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("Seiya更新联系人,原联系人:%s,新联系人:%s", oldContactInfo, contactInfo), CustomerSourceRecordPO.TYPE_COMMON_INT, operater));
					}
				}
				customerSourceDao.save(sourcePO);
			}
		}

		// 更新业务员信息（customerchance.creater 和 customersource.creater）
		if (salesmanId != null && !salesmanId.trim().isEmpty()) {
			UserPO salesmanPO = userDao.queryUserByUserId(salesmanId);
			if (salesmanPO == null) {
				throw new FLException(190005, "业务员不存在");
			}

			// 记录旧业务员信息
			String oldSalesmanName = sourcePO.getCreater() != null ? sourcePO.getCreater().getCurrentName() : "";
			String oldSalesmanId = sourcePO.getCreater() != null ? sourcePO.getCreater().getUserId() : "";

			// 更新 customerchance.creater
			if (chancePO != null) {
				chancePO.setCreater(salesmanPO);
				customerChanceDao.save(chancePO);
			}

			// 更新 customersource.creater
			if (sourcePO != null) {
				sourcePO.setCreater(salesmanPO);
				customerSourceDao.save(sourcePO);
			}

			// 记录业务员变更
			if (!salesmanId.equals(oldSalesmanId)) {
				customerSourceRecordDao.save(new CustomerSourceRecordPO().init(csid, ccid, String.format("Seiya更新业务员,原业务员:%s(%s),新业务员:%s(%s)", oldSalesmanName, oldSalesmanId, salesmanPO.getCurrentName(), salesmanId), CustomerSourceRecordPO.TYPE_COMMON_INT, operater));
			}
		}
	}

	@Override
	public DecorationVO queryCustomerLead(String orderId, String village, String houseNumber, String phone, Integer orgId) throws FLException {

		DecorationPO decorationPO = null;

		// 方式1: 通过 orderId 查询
		if (orderId != null && !orderId.trim().isEmpty()) {
			decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		}
		// 方式2: 通过 楼盘+楼号 查询
		else if (village != null && !village.trim().isEmpty() && houseNumber != null && !houseNumber.trim().isEmpty()) {
			VillageVO villageVO = new VillageVO(village);
			HouseVO queryHouse = new HouseVO();
			queryHouse.setVillage(villageVO);
			queryHouse.setHouseNumber(houseNumber);
			HouseVO houseVO = houseService.queryHouseByNoAHnum(queryHouse, orgId);

			if (houseVO != null && houseVO.getHid() != null) {
				List<Integer> companys = Arrays.asList(orgId);
				decorationPO = decorationDao.queryDecorationByHid(houseVO.getHid(), companys);
			}
		}
		// 方式3: 通过 电话 查询
		else if (phone != null && !phone.trim().isEmpty()) {
			CustomerVO customerVO = findCustomerByPhone(phone, orgId);

			if (customerVO != null && customerVO.getCid() != null) {
				List<DecorationPO> decorations = decorationDao.queryDecorationByCustomerId(customerVO.getCid());
				if (decorations != null && !decorations.isEmpty()) {
					// 取最新的订单
					decorationPO = decorations.get(0);
				}
			}
		} else {
			throw new FLException(400003, "请提供查询条件：orderId 或 楼盘+楼号 或 电话");
		}

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// PO 转 VO
		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setOrderId(decorationPO.getOrderId());
		decorationVO.setContractTime(decorationPO.getContractTime());

		// house 信息: village.no, village.name, houseNumber
		if (decorationPO.getHouse() != null) {
			HouseVO houseVO = new HouseVO();
			houseVO.setHouseNumber(SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()));

			if (decorationPO.getHouse().getVillage() != null) {
				VillageVO villageVO = new VillageVO();
				villageVO.setNo(decorationPO.getHouse().getVillage().getNo());
				villageVO.setName(decorationPO.getHouse().getVillage().getName());
				houseVO.setVillage(villageVO);
			}

			decorationVO.setHouse(houseVO);
		}

		// customer 信息: phone 脱敏
		if (decorationPO.getCustomer() != null) {
			CustomerVO customerVO = new CustomerVO();
			String decodedPhone = SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone());
			if (decodedPhone != null && decodedPhone.length() >= 7) {
				customerVO.setPhone(decodedPhone.substring(0, 3) + "****" + decodedPhone.substring(7));
			} else {
				customerVO.setPhone(decodedPhone);
			}
			decorationVO.setCustomer(customerVO);
		}

		return decorationVO;
	}

	@Override
	public void checkoverCustomerLead(String leadCode, String village, String houseNumber, String phone, Integer orgId) throws FLException {

		if (orgId == null) {
			throw new FLException(400004, "公司标识不能为空");
		}

		// 0. 如果传入了线索编号，验证客户机会状态
		if (leadCode != null && !leadCode.trim().isEmpty()) {
			CustomerChancePO chancePO = customerChanceDao.queryCustomerChanceByCno(leadCode);
			if (chancePO == null) {
				throw new FLException(330077, "客户机会不存在");
			}
			if (Arrays.asList(CustomerChancePO.STATUS_DISABLE_INT, CustomerChancePO.STATUS_COMPLETE_INT, CustomerChancePO.STATUS_FINISH_INT).contains(chancePO.getStatus())) {
				throw new FLException(330077, "客户机会不可操作");
			}
		}

		// 1. 通过电话查询客户cid
		CustomerVO customerVO = findCustomerByPhone(phone, orgId);

		long cid = 0;

		if (customerVO != null && customerVO.getCid() != null) {
			cid = customerVO.getCid();
		}

		// 2. 通过楼盘+楼号查询房屋hid
		HouseVO houseVO = findHouse(village, houseNumber, orgId);

		long hid = 0;

		if (houseVO != null && houseVO.getHid() != null) {
			hid = houseVO.getHid();
		}

		// 3. 参考DecorationService.checkOverDecoration逻辑，验证装修单是否存在
		decorationService.checkOverDecoration(cid, hid, orgId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationForSF(String orderId, String phone, String village, String houseNumber, Integer orgId, String userId) throws FLException {

		// 1. 参数校验
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(400001, "装修单号不能为空");
		}

		if (orgId == null) {
			throw new FLException(400004, "公司标识不能为空");
		}

		// 2. 查询装修单
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// 3. 处理客户电话：不存在创建，存在更新
		if (phone != null && !phone.trim().isEmpty()) {

			CustomerVO customerVO = new CustomerVO();
			customerVO.setPhone(phone);
			customerVO.setName("未知客户");

			// existCustomer: 电话不存在则创建客户+电话，存在则获取cid
			customerService.existCustomer(customerVO, orgId);

			// 通过cid获取完整客户PO（托管态）
			com.fanglin.communion.po.CustomerPO customerPO = customerDao.get(customerVO.getCid());

			if (customerPO != null) {
				decorationPO.setCustomer(customerPO);
			}
		}

		// 4. 处理楼盘楼号：不存在创建，存在更新
		if (village != null && !village.trim().isEmpty() && houseNumber != null && !houseNumber.trim().isEmpty()) {

			VillageVO villageVO = new VillageVO(village);
			HouseVO houseVO = new HouseVO();
			houseVO.setVillage(villageVO);
			houseVO.setHouseNumber(houseNumber);

			// existHouse: 房屋不存在则创建，存在则获取hid
			houseService.existHouse(houseVO, orgId);

			// 通过hid获取完整房屋PO（托管态）
			com.fanglin.communion.po.HousePO housePO = houseDao.get(houseVO.getHid());

			if (housePO != null) {
				decorationPO.setHouse(housePO);
			}
		}

		// 5. 保存更新
		decorationDao.update(decorationPO);
	}

	/**
	 * 通过电话号码查询客户信息 先通过加密后的phone查询CustomerPhonePO获取cid，再查询客户详情
	 */
	private CustomerVO findCustomerByPhone(String phone, Integer company) throws FLException {

		List<CustomerPhonePO> phonePOs = customerPhoneDao.queryCustomerPhone(SensitiveDataHelper.getAllEncryptedForms(phone), CustomerPhonePO.STATUS_ENABLE_INT, null, company);

		if (phonePOs == null || phonePOs.isEmpty()) {
			return null;
		}

		CustomerPhonePO phonePO = phonePOs.get(0);

		CustomerVO customerVO = new CustomerVO();
		customerVO.setCid(phonePO.getCid());

		return customerService.queryCustomerById(customerVO);
	}

	/**
	 * 通过楼盘编号和楼号查询房屋信息 直接使用houseDao查询，不依赖houseService
	 */
	private HouseVO findHouse(String villageNo, String houseNumber, Integer company) {

		HousePO housePO = houseDao.queryHouseByNoAHnum(villageNo, houseNumber, company);

		if (housePO == null) {
			return null;
		}

		HouseVO houseVO = new HouseVO();
		houseVO.setHid(housePO.getHid());

		return houseVO;
	}

}

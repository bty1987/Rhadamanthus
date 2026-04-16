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

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.service.HouseService;
import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.FormatUtil;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.seiya.service.A20260103Service;

@Service("A20260103Service")
@Transactional(readOnly = true)
public class A20260103ServiceImpl implements A20260103Service {

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerSourceService customerSourceService;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private HouseService houseService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private UserService userService;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

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
	public void updateCustomerLead(String leadCode, String village, String houseNumber, Integer buildArea, String phone, String name, String referOrderId, String sourceInfo, String contactInfo, String userId, Integer orgId) throws FLException {

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

		// 获取当前用户信息
		UserVO creater = userService.queryUserByUserId(new UserVO(userId));
		if (creater == null) {
			throw new FLException(190005, "人员不存在");
		}

		// 处理房屋信息（楼盘+楼号）
		HouseVO houseVO = null;
		if (village != null && !village.trim().isEmpty() && houseNumber != null && !houseNumber.trim().isEmpty()) {
			VillageVO villageVO = new VillageVO(village);

			// 查询房屋是否存在
			HouseVO queryHouse = new HouseVO();
			queryHouse.setVillage(villageVO);
			queryHouse.setHouseNumber(houseNumber);
			houseVO = houseService.queryHouseByNoAHnum(queryHouse, orgId);

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
				customerService.existCustomer(customerVO, orgId);

				// 添加电话
				CustomerPhoneVO customerPhoneVO = new CustomerPhoneVO();
				customerPhoneVO.setCid(customerVO.getCid());
				customerPhoneVO.setPhone(phone);
				customerService.addCustomerPhone(customerPhoneVO, orgId);
			}
		}

		// 更新房屋
		if (houseVO != null && houseVO.getHid() != null) {
			CustomerSourceVO sourceVO = new CustomerSourceVO();
			sourceVO.setCsid(existingChance.getSource().getCsid());
			sourceVO.setHouse(houseVO);
			customerSourceService.updateCustomerSourceForHouse(sourceVO);
		}

		// 更新客户
		if (customerVO != null && customerVO.getCid() != null) {
			CustomerSourceVO sourceVO = new CustomerSourceVO();
			sourceVO.setCsid(existingChance.getSource().getCsid());
			sourceVO.setCustomer(customerVO);
			sourceVO.setPhone(phone);
			customerSourceService.updateCustomerSourceForCustomer(sourceVO);
		}

		// 更新referOrderId、source、contact（通过DAO直接更新）
		if (referOrderId != null || sourceInfo != null || contactInfo != null) {
			CustomerSourcePO sourcePO = customerSourceDao.get(existingChance.getSource().getCsid());
			if (sourcePO != null) {
				if (referOrderId != null && !referOrderId.trim().isEmpty()) {
					sourcePO.setReferOrderId(referOrderId);
				}
				if (sourceInfo != null && !sourceInfo.trim().isEmpty()) {
					sourcePO.setSource(sourceInfo);
				}
				if (contactInfo != null && !contactInfo.trim().isEmpty()) {
					sourcePO.setContact(contactInfo);
				}
				customerSourceDao.save(sourcePO);
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
			throw new FLException(140013, "订单不存在");
		}

		// PO 转 VO
		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setOrderId(decorationPO.getOrderId());

		return decorationVO;
	}

	@Override
	public void checkoverCustomerLead(String village, String houseNumber, String phone, Integer orgId) throws FLException {

		// 参数验证
		if (phone == null || phone.trim().isEmpty()) {
			throw new FLException(400002, "客户电话不能为空");
		}

		if (village == null || village.trim().isEmpty() || houseNumber == null || houseNumber.trim().isEmpty()) {
			throw new FLException(400003, "楼盘和楼号不能为空");
		}

		if (orgId == null) {
			throw new FLException(400004, "公司标识不能为空");
		}

		// 1. 通过电话查询客户cid
		CustomerVO customerVO = findCustomerByPhone(phone, orgId);

		long cid = 0;

		if (customerVO != null && customerVO.getCid() != null) {
			cid = customerVO.getCid();
		}

		// 2. 通过楼盘+楼号查询房屋hid
		VillageVO villageVO = new VillageVO(village);
		HouseVO queryHouse = new HouseVO();
		queryHouse.setVillage(villageVO);
		queryHouse.setHouseNumber(houseNumber);
		HouseVO houseVO = houseService.queryHouseByNoAHnum(queryHouse, orgId);

		long hid = 0;

		if (houseVO != null && houseVO.getHid() != null) {
			hid = houseVO.getHid();
		}

		// 3. 参考DecorationService.checkOverDecoration逻辑，验证装修单是否存在
		if (cid != 0 || hid != 0) {
			decorationService.checkOverDecoration(cid, hid, orgId);
		}
	}

	/**
	 * 通过电话号码查询客户信息
	 * 先通过加密后的phone查询CustomerPhonePO获取cid，再查询客户详情
	 */
	private CustomerVO findCustomerByPhone(String phone, Integer company) throws FLException {

		String encodedPhone = FormatUtil.encodePhone(phone);

		List<CustomerPhonePO> phonePOs = customerPhoneDao.queryCustomerPhoneByPhone(encodedPhone, CustomerPhonePO.STATUS_ENABLE_INT, company);

		if (phonePOs == null || phonePOs.isEmpty()) {
			return null;
		}

		CustomerPhonePO phonePO = phonePOs.get(0);

		CustomerVO customerVO = new CustomerVO();
		customerVO.setCid(phonePO.getCid());

		return customerService.queryCustomerById(customerVO);
	}

}

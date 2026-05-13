/**
 * @File Name		: DecorationBelongServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.dao.CustomerChanceOrderDao;
import com.fanglin.customer.po.CustomerChanceOrderPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("orderBelongInfoService")
@Transactional(readOnly = true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

	private static final Logger log = LoggerFactory.getLogger(DecorationBelongServiceImpl.class);

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private CustomerChanceOrderDao customerChanceOrderDao;

	@Override
	public List<DecorationBelongVO> queryDecorationBelong(DecorationBelongVO decorationBelongVO) {

		List<DecorationBelongVO> decorationBelongVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryDecorationBelong(decorationBelongVO.getOrderId(), decorationBelongVO.getType(), decorationBelongVO.getStatus());

		for (DecorationBelongPO decorationBelongPO : decorationBelongPOs) {
			decorationBelongVOs.add(decorationBelongPO.ptv(new DecorationBelongVO(new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO())));
		}

		return decorationBelongVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendDecorationBelong(DecorationBelongVO decorationBelongVO) throws FLException {

		String orderId = decorationBelongVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		log.info(String.format("pages/decoration/belong/confirm?orderId=%s", orderId));

		decorationService.sendMessage(orderId, "装修单", "装修单归属变更确认.", String.format("pages/decoration/belong/confirm?orderId=%s", orderId));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmDecorationBelong(DecorationVO decorationVO, DecorationBelongVO decorationBelongVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationVO.getCustomer().getPhone() != null && !SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone()).equals(decorationVO.getCustomer().getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		if (decorationBelongDao.countDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT, DecorationBelongPO.STATUS_EFFCTIVE_INT);
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_CONFIRM_INT, DecorationBelongPO.STATUS_INVALID_INT);
		}

		if (decorationBelongDao.countDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT, DecorationBelongPO.STATUS_EFFCTIVE_INT);
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_CONFIRM_INT, DecorationBelongPO.STATUS_INVALID_INT);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranDecorationBelong(DecorationBelongVO decorationBelongVO, List<DecorationBelongVO> decorationBelongVOs) throws FLException {

		String orderId = decorationBelongVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (Arrays.asList(DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_COMPLETED_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		for (DecorationBelongVO decorationBelong : decorationBelongVOs) {
			tranDecorationBelong(decorationPO.getOrderId(), decorationBelong.getType(), decorationBelong.getBelonger().getUserId(), decorationBelongVO.getCcid());
		}

		return 0;
	}

	public int tranDecorationBelong(String orderId, Short type, String userId, Long ccid) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		DepartmentPO dept = userPO.getDept();
		DepartmentPO regn = userPO.getDept().getFatherDept();

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (type == DecorationBelongPO.BELONGTYPE_DESIGN_INT) decorationAdditionPO.clearDesign();
		else if (type == DecorationBelongPO.BELONGTYPE_SALESMAN_INT) decorationAdditionPO.clearSales();

		decorationBelongDao.updateDecorationBelong(orderId, type, DecorationBelongPO.STATUS_INVALID_INT, DecorationBelongPO.STATUS_EFFCTIVE_INT);

		DecorationBelongPO decorationBelongPO = new DecorationBelongPO();

		decorationBelongPO.setDepartment(dept);
		decorationBelongPO.setRegion(regn);

		if (dept.getBusitype() != null) decorationBelongPO.setBusitype(dept.getBusitype());

		if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == type) {
			decorationAdditionPO.setDesign(userPO.getCurrentName(), dept.getName(), regn.getName());
		} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == type) {
			decorationAdditionPO.setSales(userPO.getCurrentName(), dept.getName(), regn.getName());
		}

		if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == type) {
			decorationPO.setDesigner(userPO);
			decorationPO.setDesignDept(userPO.getDept());
		} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == type) {
			decorationPO.setSalesman(userPO);
			decorationPO.setSalesDept(userPO.getDept());
		}

		decorationBelongPO.setOrderId(decorationPO.getOrderId());
		decorationBelongPO.setBelonger(userPO);
		decorationBelongPO.setRate(1000);
		decorationBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationBelongPO.setOperater(userPO);
		decorationBelongPO.setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);

		if (ccid != null) decorationBelongPO.setCcid(ccid);

		decorationBelongPO.setType(type);
		decorationBelongPO.setStatus(DecorationBelongPO.STATUS_INVALID_INT);

		decorationBelongDao.save(decorationBelongPO);

		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(decorationPO.getOrderId(), "tranDecorationBelong", buildBelongEventArgs(decorationPO, userPO, type, ccid, ccid, (short) 0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int mergeDecorationBelong(String orderId, Short type, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (decorationBelongDao.countDecorationBelong(orderId, type, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			throw new FLException(140007, "装修归属不可操作");
		}

		DepartmentPO dept = userPO.getDept();
		DepartmentPO regn = userPO.getDept().getFatherDept();

		// 将现有的有效归属(rate=1000)改为合尺比例(rate=500)
		List<DecorationBelongPO> existBelongs = decorationBelongDao.queryDecorationBelong(orderId, type, DecorationBelongPO.STATUS_INVALID_INT);

		for (DecorationBelongPO existBelong : existBelongs) {
			existBelong.setRate(500);
			decorationBelongDao.update(existBelong);
		}

		// 捕获失效人员的ccid
		Long invalidCcid = null;
		if (existBelongs != null && !existBelongs.isEmpty()) {
			invalidCcid = existBelongs.get(0).getCcid();
		}

		// 新增新业务员的合尺归属记录，rate=500, status=0(有效)
		DecorationBelongPO newBelongPO = new DecorationBelongPO();

		newBelongPO.setDepartment(dept);
		newBelongPO.setRegion(regn);

		if (dept.getBusitype() != null) newBelongPO.setBusitype(dept.getBusitype());

		if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == type) {
			decorationPO.setDesigner(userPO);
			decorationPO.setDesignDept(userPO.getDept());
		} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == type) {
			decorationPO.setSalesman(userPO);
			decorationPO.setSalesDept(userPO.getDept());
		}

		newBelongPO.setOrderId(decorationPO.getOrderId());
		newBelongPO.setBelonger(userPO);
		newBelongPO.setRate(500);
		newBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		newBelongPO.setOperater(userPO);
		newBelongPO.setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);

		newBelongPO.setType(type);
		newBelongPO.setStatus(DecorationBelongPO.STATUS_INVALID_INT);

		decorationBelongDao.save(newBelongPO);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (DecorationBelongPO.BELONGTYPE_DESIGN_INT == type) {
			decorationAdditionPO.clearDesign();
			decorationAdditionPO.setDesign(userPO.getCurrentName(), dept.getName(), regn.getName());
		} else if (DecorationBelongPO.BELONGTYPE_SALESMAN_INT == type) {
			decorationAdditionPO.clearSales();
			decorationAdditionPO.setSales(userPO.getCurrentName(), dept.getName(), regn.getName());
		}

		decorationAdditionPO.setBelongTime(DateUtil.getDateToTimestamp(new Date()));

		decorationAdditionDao.update(decorationAdditionPO);
		decorationDao.update(decorationPO);

		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(decorationPO.getOrderId(), "mergeDecorationBelong", buildBelongEventArgs(decorationPO, userPO, type, null, invalidCcid, (short) 1)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmMergeDecorationBelong(String orderId, Short type, String userId, Long ccid) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		if (decorationBelongDao.countDecorationBelong(orderId, type, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			throw new FLException(140007, "装修归属不可操作");
		}

		DepartmentPO dept = userPO.getDept();
		DepartmentPO regn = userPO.getDept().getFatherDept();

		// 为现有有效归属生成合尺副本数据(rate=500, status=2待确认), 不直接修改原有数据
		List<DecorationBelongPO> existBelongs = decorationBelongDao.queryDecorationBelong(orderId, type, DecorationBelongPO.STATUS_INVALID_INT);

		// 捕获失效人员的ccid
		Long invalidCcid = null;
		if (existBelongs != null && !existBelongs.isEmpty()) {
			invalidCcid = existBelongs.get(0).getCcid();
		}

		for (DecorationBelongPO existBelong : existBelongs) {

			DecorationBelongPO copyBelongPO = new DecorationBelongPO();

			copyBelongPO.setDepartment(existBelong.getDepartment());
			copyBelongPO.setRegion(existBelong.getRegion());

			if (existBelong.getBusitype() != null) copyBelongPO.setBusitype(existBelong.getBusitype());

			copyBelongPO.setOrderId(existBelong.getOrderId());
			copyBelongPO.setBelonger(existBelong.getBelonger());
			copyBelongPO.setRate(500);
			copyBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			copyBelongPO.setOperater(userPO);
			copyBelongPO.setDefaultFlag(existBelong.getDefaultFlag());

			copyBelongPO.setType(type);
			copyBelongPO.setStatus(DecorationBelongPO.STATUS_CONFIRM_INT);

			decorationBelongDao.save(copyBelongPO);
		}

		// 新增新业务员的合尺归属记录，rate=500, status=2(待确认)
		DecorationBelongPO newBelongPO = new DecorationBelongPO();

		newBelongPO.setDepartment(dept);
		newBelongPO.setRegion(regn);

		if (dept.getBusitype() != null) newBelongPO.setBusitype(dept.getBusitype());

		newBelongPO.setOrderId(decorationPO.getOrderId());
		newBelongPO.setBelonger(userPO);
		newBelongPO.setRate(500);
		newBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		newBelongPO.setOperater(userPO);
		newBelongPO.setDefaultFlag(DecorationBelongPO.DEFAULTFLAG_TRUE_INT);

		newBelongPO.setType(type);
		newBelongPO.setStatus(DecorationBelongPO.STATUS_CONFIRM_INT);

		if (ccid != null) newBelongPO.setCcid(ccid);

		decorationBelongDao.save(newBelongPO);

		// 生成消息提示数据：invalidCcid=失效人员ccid, ccid=生效人员ccid
		messageQueuingDao.save(new MessageCueuingPO().init(decorationPO.getOrderId(), "confirmMergeDecorationBelong", buildBelongEventArgs(decorationPO, userPO, type, invalidCcid, ccid, (short) 1)));

		return 0;
	}

	private String buildBelongEventArgs(DecorationPO decorationPO, UserPO userPO, short type, Long invalidCcid, Long activeCcid, short mergeFlag) {

		String orderId = decorationPO.getOrderId();
		String invalidOrderId = "";
		String activeOrderId = "";

		if (invalidCcid != null && invalidCcid > 0) {
			CustomerChanceOrderPO chanceOrder = customerChanceOrderDao.queryCustomerChanceOrder(invalidCcid);
			if (chanceOrder != null) invalidOrderId = chanceOrder.getOrderId();
		}

		if (activeCcid != null && activeCcid > 0) {
			CustomerChanceOrderPO chanceOrder = customerChanceOrderDao.queryCustomerChanceOrder(activeCcid);
			if (chanceOrder != null) activeOrderId = chanceOrder.getOrderId();
		}

		return "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userPO.getUserId() + "\",\"belongType\":" + type + ",\"event\":\"" + (type == DecorationBelongPO.BELONGTYPE_DESIGN_INT ? "TEAM_DESIGNER_CHANGED" : "TEAM_SALESMAN_CHANGED") + "\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + ",\"invalidOrderId\":\"" + invalidOrderId + "\",\"activeOrderId\":\"" + activeOrderId + "\",\"mergeFlag\":" + mergeFlag + "}";
	}
}

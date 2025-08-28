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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
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
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

@Service("orderBelongInfoService")
@Transactional(readOnly = true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

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

		System.out.println(String.format("pages/decoration/belong/confirm?orderId=%s", orderId));

		decorationService.sendMessage(orderId, "装修单", "装修单归属变更确认.", String.format("pages/decoration/belong/confirm?orderId=%s", orderId));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmDecorationBelong(DecorationVO decorationVO, DecorationBelongVO decorationBelongVO, String securityCode, String verifyCode) throws FLException {

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

		if (decorationVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(FormatUtil.encodePhone(decorationVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		if (decorationBelongDao.countDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.STATUS_INVALID_INT, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_EFFCTIVE_INT);
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.STATUS_CONFIRM_INT, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		}

		if (decorationBelongDao.countDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_CONFIRM_INT) > 0) {
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.STATUS_INVALID_INT, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_EFFCTIVE_INT);
			decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.STATUS_CONFIRM_INT, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);
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
			tranDecorationBelong(decorationPO.getOrderId(), decorationBelong.getType(), decorationBelong.getBelonger().getUserId());
		}

		return 0;
	}

	public int tranDecorationBelong(String orderId, Short type, String userId) throws FLException {

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

		decorationBelongDao.updateDecorationBelong(orderId, DecorationBelongPO.STATUS_INVALID_INT, type, DecorationBelongPO.STATUS_EFFCTIVE_INT);

		DecorationBelongPO decorationBelongPO = new DecorationBelongPO();

		decorationBelongPO.setDepartment(dept);
		decorationBelongPO.setRegion(regn);

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

		decorationBelongPO.setType(type);
		decorationBelongPO.setStatus(DecorationBelongPO.STATUS_INVALID_INT);

		decorationBelongDao.save(decorationBelongPO);

		return 0;
	}
}

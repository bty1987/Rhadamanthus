package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.service.DecorationUserService;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.log.context.ActionLogContext;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationUserService")
@Transactional(readOnly = true)
public class DecorationUserServiceImpl implements DecorationUserService {

	@Autowired
	private DecorationUserDao decorationUserDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageDecorationForUser(Paging paging, List<Filter> filters, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<DecorationPO> decorationPOs = decorationUserDao.pageDecorationForUser(paging, filters, userPO.getUid());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public List<DecorationUserVO> queryDecorationUser(Paging paging, List<Filter> filters, DecorationUserVO decorationUserVO) {

		String orderId = decorationUserVO.getOrderId();

		List<DecorationUserPO> decorationUserPOs = decorationUserDao.queryDecorationUser(paging, filters, orderId, null);
		List<DecorationUserVO> decorationUserVOs = new ArrayList<DecorationUserVO>();

		for (DecorationUserPO decorationUserPO : decorationUserPOs) {
			decorationUserVOs.add(decorationUserPO.ptv(new DecorationUserVO(new UserBaseVO(new DutyVO()))));
		}

		paging.setData(decorationUserVOs);

		return decorationUserVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationUser(DecorationUserVO decorationUserVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(decorationUserVO.getUser().getUserId());

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		Short type = decorationUserVO.getType() == null ? DecorationUserPO.TYPE_OTHER_INT : decorationUserVO.getType();

		if (decorationUserDao.countDecorationUser(decorationUserVO.getOrderId(), userPO.getUid(), type) > 0) {
			throw new FLException(140078, "服务团队成员已存在");
		}

		// 团队成员变更留痕: actionLog 记录"谁给哪个订单加了谁"(params 已含被加人/类型/角色)
		ActionLogContext.bind("decoration", decorationUserVO.getOrderId(), "ADD");

		DecorationUserPO decorationUserPO = new DecorationUserPO();

		BeanUtil.copyPropertie(decorationUserVO, decorationUserPO, Arrays.asList("user", "creater"));

		decorationUserPO.setUser(userPO);
		decorationUserPO.setType(type);
		decorationUserPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationUserPO.setCreater(userDao.queryUserByUserId(userId));

		decorationUserDao.save(decorationUserPO);

		decorationUserVO.setDuid(decorationUserPO.getDuid());
		decorationUserVO.setIsShow(decorationUserPO.getIsShow());
		decorationUserVO.setIsPay(decorationUserPO.getIsPay());
		decorationUserVO.setType(decorationUserPO.getType());

		UserBaseVO userBaseVO = new UserBaseVO(new DutyVO());

		BeanUtil.copyPropertie(userPO, userBaseVO, Arrays.asList("duty", "dept", "role"));
		BeanUtil.copyPropertie(userPO.getDuty(), userBaseVO.getDuty(), Arrays.asList("departmentType"));

		decorationUserVO.setUser(userBaseVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationUser(DecorationUserVO decorationUserVO) throws FLException {

		DecorationUserPO decorationUserPO = decorationUserDao.get(decorationUserVO.getDuid());

		if (decorationUserPO == null) {
			throw new FLException(140077, "人员不存在");
		}

		// 团队成员变更留痕: actionLog 记录"谁改了哪个订单的成员属性"(isShow/isPay/content)
		ActionLogContext.bind("decoration", decorationUserPO.getOrderId(), "UPDATE");

		if (decorationUserVO.getIsShow() != null) {
			decorationUserPO.setIsShow(decorationUserVO.getIsShow());
		}

		if (decorationUserVO.getIsPay() != null) {
			decorationUserPO.setIsPay(decorationUserVO.getIsPay());
		}

		if (decorationUserVO.getContent() != null) {
			decorationUserPO.setContent(decorationUserVO.getContent());
		}

		decorationUserDao.update(decorationUserPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationUser(DecorationUserVO decorationUserVO) throws FLException {

		DecorationUserPO decorationUserPO = decorationUserDao.get(decorationUserVO.getDuid());

		if (decorationUserPO == null) {
			throw new FLException(140077, "人员不存在");
		}

		// 团队成员变更留痕: 物理删除无行级痕迹, actionLog 是唯一追溯点(params 含 duid)
		ActionLogContext.bind("decoration", decorationUserPO.getOrderId(), "DELETE");

		decorationUserDao.delete(decorationUserPO);

		return 0;
	}

}

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PointofsalesDao;
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.payment.service.PointofsalesService;
import com.fanglin.payment.utils.Airpos;
import com.fanglin.payment.vo.PointofsalesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("pointofsalesService")
@Transactional(readOnly = true)
public class PointofsalesServiceImpl implements PointofsalesService {

	@Autowired
	private PointofsalesDao pointofsalesDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pagePointofsales(Paging paging, List<Filter> filters) {

		List<PointofsalesPO> pointofsalesPOs = pointofsalesDao.pagePointofsales(paging, filters);
		List<PointofsalesVO> pointofsalesVOs = new ArrayList<PointofsalesVO>();

		for (PointofsalesPO pointofsalesPO : pointofsalesPOs) {

			PointofsalesVO pointofsalesVO = new PointofsalesVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			BeanUtil.copyProperties(pointofsalesPO, pointofsalesVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(pointofsalesPO.getCreater(), pointofsalesVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			pointofsalesVOs.add(pointofsalesVO);
		}
		
		paging.setData(pointofsalesVOs);
		
	}

	@Override
	public List<PointofsalesVO> queryPointofsalesByPid(PointofsalesVO pointofsales) {

		List<PointofsalesPO> pointofsalesPOs = pointofsalesDao.queryPointofsalesByPid(pointofsales.getPid(), pointofsales.getType());
		List<PointofsalesVO> pointofsalesVOs = new ArrayList<PointofsalesVO>();

		for (PointofsalesPO pointofsalesPO : pointofsalesPOs) {

			PointofsalesVO pointofsalesVO = new PointofsalesVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			BeanUtil.copyProperties(pointofsalesPO, pointofsalesVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(pointofsalesPO.getCreater(), pointofsalesVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			pointofsalesVOs.add(pointofsalesVO);
		}

		return pointofsalesVOs;

	}
	
	@Override
	public List<PointofsalesVO> queryPointofsalesByPidAndRid(PointofsalesVO pointofsales) {

		List<PointofsalesPO> pointofsalesPOs = pointofsalesDao.queryPointofsalesByPidAndRid(pointofsales.getPid(), pointofsales.getRid());
		List<PointofsalesVO> pointofsalesVOs = new ArrayList<PointofsalesVO>();

		for (PointofsalesPO pointofsalesPO : pointofsalesPOs) {

			PointofsalesVO pointofsalesVO = new PointofsalesVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			BeanUtil.copyProperties(pointofsalesPO, pointofsalesVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(pointofsalesPO.getCreater(), pointofsalesVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			pointofsalesVOs.add(pointofsalesVO);
		}

		return pointofsalesVOs;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPointofsales(PointofsalesVO pointofsalesVO, String userId) throws FLException {

		if (Arith.div(pointofsalesVO.getMoney(), 10000) == 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		if (pointofsalesDao.countPointofsales(pointofsalesVO.getSn(), PointofsalesPO.STATUS_INIT_INT) != 0) {
			throw new FLException(150048, "POS支付未完成");
		}

		PointofsalesPO pointofsalesPO = new PointofsalesPO();

		UserPO creater = userDao.queryUserByUserId(userId);

		BeanUtil.copyProperties(pointofsalesVO, pointofsalesPO, Arrays.asList("creater"));

		pointofsalesPO.setStatus(PointofsalesPO.STATUS_INIT_INT);
		pointofsalesPO.setCreater(creater);

		Airpos.send(pointofsalesVO.getWay(), pointofsalesPO);

		pointofsalesDao.save(pointofsalesPO);

		pointofsalesVO.setPosid(pointofsalesPO.getPosid());
		pointofsalesVO.setMsgId(pointofsalesPO.getMsgId());
		pointofsalesVO.setCreateTime(pointofsalesPO.getCreateTime());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkPointofsales(PointofsalesVO pointofsalesVO) throws FLException {

		PointofsalesPO pointofsalesPO = pointofsalesDao.get(pointofsalesVO.getPosid());

		if (pointofsalesPO == null) {
			throw new FLException(150043, "POS支付不存在");
		}

		if (pointofsalesPO.getStatus() != PointofsalesPO.STATUS_INIT_INT) {
			throw new FLException(150047, "POS支付不可操作");
		}

		Airpos.check(pointofsalesPO);

		pointofsalesDao.update(pointofsalesPO);

		pointofsalesVO.setStatus(pointofsalesPO.getStatus());
		pointofsalesVO.setCreateTime(pointofsalesPO.getCreateTime());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelPointofsales(PointofsalesVO pointofsalesVO) throws FLException {

		PointofsalesPO pointofsalesPO = pointofsalesDao.get(pointofsalesVO.getPosid());

		if (pointofsalesPO == null) {
			throw new FLException(150043, "POS支付不存在");
		}

		if (pointofsalesPO.getStatus() != PointofsalesPO.STATUS_FAIL_INT) {
			throw new FLException(150047, "POS支付不可操作");
		}

		pointofsalesPO.setStatus(PointofsalesPO.STATUS_INVALID_INT);

		pointofsalesDao.update(pointofsalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePointofsales(List<Long> posids, Long rid, Short status, Short type) throws FLException {
		
		int count = pointofsalesDao.countPointofsalesByPosids(posids);
		
		if(count > 0){
			throw new FLException(150047, "POS支付不可操作");
		}
		
		pointofsalesDao.updatePointofsales(posids, rid, status, type);
		
	}
}

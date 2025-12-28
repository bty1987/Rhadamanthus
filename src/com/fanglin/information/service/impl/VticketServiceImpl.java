package com.fanglin.information.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VticketService;
import com.fanglin.information.vo.VticketVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatMessageService;

@Service("vticketService")
@Transactional(readOnly = true)
public class VticketServiceImpl implements VticketService {

	@Autowired
	private VticketDao vticketDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private EmemberDao ememberDao;

	@Autowired
	private WeChatMessageService messageService;

	@Override
	public void pageVticket(Paging paging, List<Filter> filters) {

		List<VticketPO> vticketPOs = vticketDao.pageVticket(paging, filters);
		List<VticketVO> vticketVOs = new ArrayList<VticketVO>();

		for (VticketPO vticketPO : vticketPOs) {
			vticketVOs.add(new VticketVO(new UserVO(), new UserVO(), new DepartmentVO(), new DepartmentVO()).ptv(vticketPO));
		}

		paging.setData(vticketVOs);
	}

	@Override
	public void pageVticketForBelonger(Paging paging, List<Filter> filters, String userId) {

		UserPO belonge = userDao.queryUserByUserId(userId);

		filters.add(new Filter(VticketPO.COLUMN_BELONGER_STR, String.valueOf(belonge.getUid()), "eq"));

		List<VticketPO> vticketPOs = vticketDao.pageVticket(paging, filters);
		List<VticketVO> vticketVOs = new ArrayList<VticketVO>();

		for (VticketPO vticketPO : vticketPOs) {
			vticketVOs.add(new VticketVO(new UserVO(), new UserVO(), new DepartmentVO(), new DepartmentVO()).ptv(vticketPO));
		}

		paging.setData(vticketVOs);
	}

	@Override
	public List<?> countVticket(short param) {

		List<?> counts = vticketDao.countVticket(param);

		return counts;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void createVticket(VticketVO vticketVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(vticketVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修订单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);
		UserPO belonger = userDao.queryUserByUserId(vticketVO.getBelonger().getUserId());

		VticketPO vticketPO = new VticketPO(creater, belonger, belonger.getDept(), belonger.getDept().getFatherDept());

		BeanUtil.copyProperties(vticketVO, vticketPO, Arrays.asList("creater", "belonger", "department", "region"));

		vticketPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		vticketDao.save(vticketPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateVticket(VticketVO vticketVO) throws FLException {

		VticketPO vticketPO = vticketDao.get(vticketVO.getVtid());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		UserPO belonger = userDao.queryUserByUserId(vticketVO.getBelonger().getUserId());

		vticketPO.setBelonger(belonger);
		vticketPO.setDepartment(belonger.getDept());
		vticketPO.setRegion(belonger.getDept().getFatherDept());
		vticketPO.setOrderId(vticketVO.getOrderId());
		vticketPO.setName(vticketVO.getName());
		vticketPO.setPhone(vticketVO.getPhone());
		vticketPO.setAddress(vticketVO.getAddress());

		vticketDao.update(vticketPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void registVticket(VticketVO vticketVO) throws FLException {

		VticketPO vticketPO = vticketDao.queryVticketByTno(vticketVO.getTno());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		vticketPO.setIsregist(VticketPO.ISREGIST_YES_INT);

		vticketDao.update(vticketPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void comeVticket(VticketVO vticketVO) throws FLException {

		String no = vticketVO.getTno();

		VticketPO vticketPO = vticketDao.queryVticketByTno(no);

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		if (vticketPO.getIsregist() != VticketPO.ISREGIST_YES_INT) {
			throw new FLException(160045, "活动票未注册");
		}

		if (vticketPO.getIscome() == VticketPO.ISCOME_YES_INT) {
			throw new FLException(160027, "活动票已到场");
		}

		vticketPO.setIscome(VticketPO.ISCOME_YES_INT);

		vticketDao.update(vticketPO);

		EmemberPO ememberPO = ememberDao.queryEmemberByNo(no);

		if (ememberPO != null) {
			messageService.sendServiceSchedule(ememberPO.getUnionId(), "活动", no, "已到场");
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void takeVticket(VticketVO vticketVO, String userId) throws FLException {

		VticketPO vticketPO = vticketDao.queryVticketByTno(vticketVO.getTno());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		if (vticketPO.getBelonger() != null) {
			throw new FLException(160051, "活动票不可操作");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		vticketPO.setBelonger(userPO);
		vticketPO.setDepartment(userPO.getDept());
		vticketPO.setRegion(userPO.getDept().getFatherDept());

		vticketDao.update(vticketPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freeVticket(VticketVO vticketVO, String userId) throws FLException {

		VticketPO vticketPO = vticketDao.get(vticketVO.getVtid());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		if (vticketPO.getExpire() != VticketPO.EXPIRE_INIT_INT) {
			throw new FLException(160051, "活动票不可操作");
		}

		if (vticketPO.getBelonger() == null) {
			throw new FLException(160051, "活动票不可操作");
		}

		if (!vticketPO.getBelonger().getUserId().equals(userId)) {
			throw new FLException(160051, "活动票不可操作");
		}

		vticketPO.setBelonger(null);
		vticketPO.setDepartment(null);
		vticketPO.setRegion(null);

		vticketDao.update(vticketPO);
	}

}

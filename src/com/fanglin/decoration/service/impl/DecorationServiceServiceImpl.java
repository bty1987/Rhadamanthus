package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationServiceDaoImpl;
import com.fanglin.decoration.po.DecorationServiceDO;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.decoration.service.DecorationServiceService;
import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationServiceService")
@Transactional(readOnly = true)
public class DecorationServiceServiceImpl implements DecorationServiceService {

	@Autowired
	private DecorationServiceDaoImpl decorationServiceDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageDecorationService(Paging paging, java.util.List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		// 调用DAO层进行分页查询
		List<DecorationServiceDO> decorationServiceDOs = decorationServiceDao.pageDecorationService(paging, filters, authentication.getCompany());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();

		// PO转VO
		for (DecorationServiceDO decorationServiceDO : decorationServiceDOs) {
			decorationServiceVOs.add(decorationServiceDO.ptv(new DecorationServiceVO(new DecorationVO(), new UserBaseVO(new DutyVO()))));
		}

		// 设置分页数据
		paging.setData(decorationServiceVOs);
	}

	@Override
	public List<DecorationServiceVO> queryDecorationServiceByOrderId(DecorationServiceVO decorationServiceVO) {

		List<DecorationServicePO> decorationServicePOs = decorationServiceDao.queryDecorationServiceByOrderId(decorationServiceVO.getOrderId());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();

		for (DecorationServicePO decorationServicePO : decorationServicePOs) {
			decorationServiceVOs.add(decorationServicePO.ptv(new DecorationServiceVO(new UserBaseVO(new DutyVO()))));
		}

		return decorationServiceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecortionService(DecorationServiceVO decorationServiceVO, Authentication authentication) {

		String userId = authentication.getUserId();

		UserPO operater = userDao.queryUserByUserId(userId);

		DecorationServicePO decorationServicePO = new DecorationServicePO();

		BeanUtil.copyProperties(decorationServiceVO, decorationServicePO);
		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
		decorationServicePO.setOperater(operater);
		decorationServicePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationServicePO.setComment("");
		decorationServicePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		// 计算超期天数：根据type获取最近一次的服务记录，累积超期天数
		int overdueDays = 0;
		if (decorationServicePO.getType() > 0) {
			DecorationServicePO latestService = decorationServiceDao.queryDecorationService(decorationServicePO.getOrderId(), decorationServicePO.getType());
			if (latestService != null && latestService.getCreateTime() != null) {
				Timestamp latestCreateTime = latestService.getCreateTime();
				Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
				int daysDiff = DateUtil.diffDay(latestCreateTime, currentTime);
				if (daysDiff > 0) {
					overdueDays = latestService.getOverdueDays() + daysDiff;
				} else {
					overdueDays = latestService.getOverdueDays();
				}
			}
		}
		decorationServicePO.setOverdueDays(overdueDays);

		decorationServiceDao.save(decorationServicePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int completeDecorationService(DecorationServiceVO decorationServiceVO) throws FLException {

		DecorationServicePO decorationServicePO = decorationServiceDao.get(decorationServiceVO.getDsid());

		if (decorationServicePO == null) {
			throw new FLException(140055, "装修服务不存在");
		}

		if (decorationServicePO.getStatus() != DecorationServicePO.SERVICESTATUS_INIT_INT) {
			throw new FLException(140056, "装修服务不可操作");
		}

		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_FINISH_INT);
		decorationServicePO.setComment(decorationServiceVO.getComment());

		decorationServiceDao.saveOrUpdate(decorationServicePO);

		return 0;
	}

}

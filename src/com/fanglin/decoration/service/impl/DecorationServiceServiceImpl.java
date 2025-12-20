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
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.dao.impl.DecorationServiceDaoImpl;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.decoration.service.DecorationServiceService;
import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;


@Service("decorationServiceService")
@Transactional(readOnly=true)
public class DecorationServiceServiceImpl implements DecorationServiceService{

	@Autowired
	private DecorationServiceDaoImpl decorationServiceDao;
	
	@Autowired
	private UserDao userDao;
	
	
	@Override
	public List<DecorationServiceVO> queryDecorationServiceByOrderId(DecorationServiceVO decorationServiceVO) {
		
		List<DecorationServicePO> decorationServicePOs = decorationServiceDao.queryDecorationServiceByOrderId(decorationServiceVO.getOrderId());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();
		
		for (DecorationServicePO decorationServicePO : decorationServicePOs) {
			decorationServiceVO = new DecorationServiceVO(new UserBaseVO(new DutyVO()));
			
			BeanUtil.copyProperties(decorationServicePO, decorationServiceVO,Arrays.asList("operater"));
			BeanUtil.copyProperties(decorationServicePO.getOperater(),decorationServiceVO.getOperater(),Arrays.asList("duty","dept"));
			BeanUtil.copyProperties(decorationServicePO.getOperater().getDuty(), decorationServiceVO.getOperater().getDuty(),Arrays.asList("departmentType"));
			
			decorationServiceVOs.add(decorationServiceVO);
		}
		
		return decorationServiceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecortionService(DecorationServiceVO decorationServiceVO,Authentication authentication) {
		
		String userId = authentication.getUserId();
		UserPO operater = userDao.queryUserByUserId(userId);
		
		DecorationServicePO decorationServicePO = new DecorationServicePO();
		
		BeanUtil.copyProperties(decorationServiceVO, decorationServicePO);
		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
		decorationServicePO.setOperater(operater);
		decorationServicePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationServicePO.setComment("");
		
		decorationServiceDao.save(decorationServicePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int completeDecorationService(DecorationServiceVO decorationServiceVO) throws FLException{
		
		DecorationServicePO decorationServicePO = decorationServiceDao.get(decorationServiceVO.getDsid());
		
		if(decorationServicePO == null){
			throw new FLException(140055,"装修服务不存在");
		}
		
		if(decorationServicePO.getStatus() != DecorationServicePO.SERVICESTATUS_INIT_INT){
			throw new FLException(140056,"装修服务不可操作");
		}
		
		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_FINISH_INT);
		decorationServicePO.setComment(decorationServiceVO.getComment());
			
		decorationServiceDao.saveOrUpdate(decorationServicePO);

		return 0;
	}

	@Override
	public void pageDecorationService(com.fanglin.utils.Paging paging, java.util.List<com.fanglin.core.vo.Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		// 用户验证
		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
		if (userPO == null) return;

		// 调用DAO层进行分页查询
		List<DecorationServicePO> decorationServicePOs = decorationServiceDao.pageDecorationService(paging, filters, authentication.getCompany());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();

		// PO转VO
		for (DecorationServicePO decorationServicePO : decorationServicePOs) {
			DecorationServiceVO decorationServiceVO = new DecorationServiceVO(new UserBaseVO(new DutyVO()));

			BeanUtil.copyProperties(decorationServicePO, decorationServiceVO, Arrays.asList("operater"));

			// 设置操作员信息
			if (decorationServicePO.getOperater() != null) {
				BeanUtil.copyProperties(decorationServicePO.getOperater(), decorationServiceVO.getOperater(), Arrays.asList("duty", "dept"));
				if (decorationServicePO.getOperater().getDuty() != null) {
					BeanUtil.copyProperties(decorationServicePO.getOperater().getDuty(), decorationServiceVO.getOperater().getDuty(), Arrays.asList("departmentType"));
				}
			}

			decorationServiceVOs.add(decorationServiceVO);
		}

		// 设置分页数据
		paging.setData(decorationServiceVOs);
	}

}

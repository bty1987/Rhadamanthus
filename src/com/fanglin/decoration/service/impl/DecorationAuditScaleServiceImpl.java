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
import com.fanglin.decoration.dao.DecorationAuditRecordDao;
import com.fanglin.decoration.dao.DecorationAuditScaleDao;
import com.fanglin.decoration.po.DecorationAuditRecordPO;
import com.fanglin.decoration.po.DecorationAuditScalePO;
import com.fanglin.decoration.service.DecorationAuditScaleService;
import com.fanglin.decoration.vo.DecorationAuditScaleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationAuditScaleService")
@Transactional(readOnly = true)
public class DecorationAuditScaleServiceImpl implements DecorationAuditScaleService {

	@Autowired
	private DecorationAuditScaleDao decorationAuditScaleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationAuditRecordDao decorationAuditRecordDao;

	@Override
	public List<DecorationAuditScaleVO> queryDecorationAuditScaleByArid(DecorationAuditScaleVO auditScale) {

		List<DecorationAuditScaleVO> auditScaleVOs = new ArrayList<DecorationAuditScaleVO>();
		List<DecorationAuditScalePO> auditScalePOs = decorationAuditScaleDao.queryDecorationAuditScaleByArid(auditScale.getAuditRecord().getArid());

		for(DecorationAuditScalePO auditScalePO:auditScalePOs){
			DecorationAuditScaleVO auditScaleVO = new DecorationAuditScaleVO(new UserBaseVO(),new DepartmentVO(),new UserBaseVO());

			BeanUtil.copyProperties(auditScalePO, auditScaleVO,Arrays.asList("belongUser","belongDepartment","creater"));
			BeanUtil.copyProperties(auditScalePO.getCreater(), auditScaleVO.getCreater(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(auditScalePO.getBelongUser(), auditScaleVO.getBelongUser(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(auditScalePO.getBelongDepartment(), auditScaleVO.getBelongDepartment(),Arrays.asList("fatherDept", "type", "manager"));

			auditScaleVOs.add(auditScaleVO);
		}


		return auditScaleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationAuditScale(List<DecorationAuditScaleVO> auditScales, String userId) throws FLException {

		DecorationAuditRecordPO auditRecordPO = decorationAuditRecordDao.queryDecorationAuditRecordByArid(auditScales.get(0).getAuditRecord().getArid());

		if(auditRecordPO == null){
			throw new FLException(140044 , "审批记录不存在");
		}

		if(auditRecordPO.getStatus()!=DecorationAuditRecordPO.STATUS_INIT_SHORT){
			throw new FLException(140045 , "审批记录状态不可操作");
		}

		auditRecordPO.setStatus(DecorationAuditRecordPO.STATUS_NOTINIT_SHORT);

		decorationAuditRecordDao.update(auditRecordPO);

		for(DecorationAuditScaleVO auditScaleVO:auditScales){

			List<DecorationAuditScalePO> _auditScales = decorationAuditScaleDao.queryDecorationAuditScaleByArid(auditScaleVO.getAuditRecord().getArid());

			for(DecorationAuditScalePO auditScalePO:_auditScales){
				if(!(auditScalePO.getStatus() == DecorationAuditScalePO.STATUS_INIT_INT ||auditScalePO.getStatus() == DecorationAuditScalePO.STATUS_CONFIRM_INT )){
					throw new FLException(140046, "审批比例生成失败");
				}
			}

			DecorationAuditScalePO auditScalePO = new DecorationAuditScalePO(new UserPO(),new DepartmentPO());

			BeanUtil.copyProperties(auditScaleVO, auditScalePO,Arrays.asList("auditRecord","belongUser","belongDepartment","creater"));

			auditScalePO.setArid(auditScaleVO.getAuditRecord().getArid());

			UserPO belonguser = userDao.get(auditScaleVO.getBelongUser().getUid());
			auditScalePO.setBelongUser(belonguser);
			auditScalePO.setBelongDepartment(belonguser.getDept());

			UserPO creater = userDao.queryUserByUserId(userId);
			auditScalePO.setCreater(creater);
			auditScalePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationAuditScaleDao.save(auditScalePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationAuditScale(DecorationAuditScaleVO auditScale, String userId) throws FLException{
		DecorationAuditScalePO auditScalePO = new DecorationAuditScalePO(new UserPO(),new DepartmentPO());

		BeanUtil.copyProperties(auditScale, auditScalePO,Arrays.asList("belongUser","belongDepartment","creater"));

		DecorationAuditRecordPO auditRecordPO = decorationAuditRecordDao.get(auditScale.getAuditRecord().getArid());

		if(auditRecordPO == null){
			throw new FLException(140046 , "审批比例生成失败");
		}

		List<DecorationAuditScalePO> auditScalePOs = decorationAuditScaleDao.queryDecorationAuditScaleByArid(auditScale.getAuditRecord().getArid());

		for(DecorationAuditScalePO auditScalePOO:auditScalePOs){
			if(!(auditScalePOO.getStatus() == DecorationAuditScalePO.STATUS_INIT_INT ||auditScalePOO.getStatus() == DecorationAuditScalePO.STATUS_CONFIRM_INT )){
				throw new FLException(140047, "审批比例信息状态不可操作");
			}
		}
		auditScalePO.setArid(auditRecordPO.getArid());

		UserPO belonguser = userDao.queryUserByUserId(auditScale.getBelongUser().getUserId());
		auditScalePO.setBelongUser(belonguser);
		auditScalePO.setBelongDepartment(belonguser.getDept());

		UserPO creater = userDao.queryUserByUserId(userId);
		auditScalePO.setCreater(creater);
		auditScalePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationAuditScaleDao.save(auditScalePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationAuditScaleForStatus(DecorationAuditScaleVO auditScale) throws FLException{
		DecorationAuditScalePO auditScalePO = decorationAuditScaleDao.get(auditScale.getAsid());

		boolean status = true;

		if(auditScale.getStatus()==DecorationAuditScalePO.STATUS_CONFIRM_INT  && auditScalePO.getStatus()==DecorationAuditScalePO.STATUS_INIT_INT){
			status = false;
		}else if(auditScale.getStatus()==DecorationAuditScalePO.STATUS_CHARGE_INT  && auditScalePO.getStatus()==DecorationAuditScalePO.STATUS_CONFIRM_INT){
			status = false;
		}else if(auditScale.getStatus()==DecorationAuditScalePO.STATUS_ROLL_INT  && auditScalePO.getStatus()==DecorationAuditScalePO.STATUS_CHARGE_INT){
			status = false;
		}

		if(status){
			throw new FLException(140047 , "审批比例信息状态不可操作");
		}

		auditScalePO.setStatus(auditScale.getStatus());

		decorationAuditScaleDao.save(auditScalePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationAuditScale(DecorationAuditScaleVO auditScale) throws FLException {

		DecorationAuditScalePO auditScalePO = decorationAuditScaleDao.get(auditScale.getAsid());

		if(!(auditScalePO.getStatus() == DecorationAuditScalePO.STATUS_INIT_INT ||auditScalePO.getStatus() == DecorationAuditScalePO.STATUS_CONFIRM_INT )){
			throw new FLException(140047 , "审批比例信息状态不可操作");
		}

		decorationAuditScaleDao.delete(auditScalePO);

		return 0;
	}

}

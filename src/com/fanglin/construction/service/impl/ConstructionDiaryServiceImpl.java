package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.construction.dao.ConstructionDiaryDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionDiaryPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionDiaryDrawingService;
import com.fanglin.construction.service.ConstructionDiaryService;
import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionDiaryService")
@Transactional(readOnly = true)
public class ConstructionDiaryServiceImpl implements ConstructionDiaryService {

	@Autowired
	private ConstructionDiaryDao constructionDiaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ConstructionDiaryService constructionDiaryService;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private ConstructionDiaryDrawingService constructionDiaryDrawingService;
	
	@Override
	public void pageConstructionDiary(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionDiaryPO> constructionDiaryPOs = constructionDiaryDao.pageConstructionDiary(paging, filters, company);
		List<ConstructionDiaryVO> constructionDiaryVOs = new ArrayList<ConstructionDiaryVO>();
		
		for (ConstructionDiaryPO constructionDiaryPO : constructionDiaryPOs) {
			
			constructionDiaryVOs.add(constructionDiaryPO.ptv(new ConstructionDiaryVO(new DecorationVO(),new UserBaseVO())));
		
		}

		paging.setData(constructionDiaryVOs);
	}
	
	@Override
	public List<ConstructionDiaryVO> queryConstructionDiary(ConstructionDiaryVO constructionDiaryVO) throws FLException {

		List<ConstructionDiaryPO> constructionDiaryPOs = constructionDiaryDao.queryConstructionDiary(constructionDiaryVO);
		List<ConstructionDiaryVO> constructionDiaryVOs = new ArrayList<ConstructionDiaryVO>();
		
		for (ConstructionDiaryPO constructionDiaryPO : constructionDiaryPOs) {
			
			constructionDiaryVOs.add(constructionDiaryPO.ptv(new ConstructionDiaryVO(new DecorationVO(),new UserBaseVO())));
		
		}

		return constructionDiaryVOs;
	} 
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionDiary(ConstructionDiaryVO constructionDiaryVO,ConstructionDiaryDrawingVO constructionDiaryDrawing, String userId, Integer company) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionDiaryVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionDiaryVO.getDecoration().getOrderId());
		
		if(constructionDiaryVO.getAtttype() == ConstructionDiaryVO.COLUMN_ATTTYPE_ENTER){
			
			constructionDiaryService.enterConstructionDiary(constructionDiaryVO.getCsid());
			
		}
		
		if(constructionDiaryVO.getAtttype() == ConstructionDiaryVO.COLUMN_ATTTYPE_LEAVE){
			
			constructionDiaryService.leaveConstructionDiary(constructionDiaryVO.getCsid());
			
		}
		
		ConstructionDiaryPO constructionDiaryPO = new ConstructionDiaryPO();
		
		BeanUtil.copyPropertie(constructionDiaryVO, constructionDiaryPO,Arrays.asList("creater", "decoration"));
		
		constructionDiaryPO.setCreater(userDao.queryUserByUserId(userId));
		constructionDiaryPO.setDecoration(decorationPO);
		
		constructionDiaryDao.save(constructionDiaryPO);
		
		if (constructionDiaryDrawing != null) {
			constructionDiaryDrawingService.addConstructionDiaryDrawing(constructionDiaryDrawing, userId, company);
		}
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enterConstructionDiary(Long csid) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(csid);

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getWorkStatus() != ConstructionSchedulePO.WORKSTATUS_INIT_INT) {
			return;
		}

		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_ENTER_INT);
		constructionSchedulePO.setEnterTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
	}
	

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void leaveConstructionDiary(Long csid) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(csid);

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getWorkStatus() != ConstructionSchedulePO.WORKSTATUS_ENTER_INT) {
			return;
		}

		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_LEAVE_INT);
		constructionSchedulePO.setLeaveTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
	}
}

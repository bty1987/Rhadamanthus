package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerSalaryService")
@Transactional(readOnly = true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService {

	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Autowired
	private UserDao userdao;

	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Override
	public void pageWorkerSalary(Paging paging, List<Filter> filters, int company) {
		
		List<WorkerSalaryPO> WorkerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging,filters,company);
		
		List<WorkerSalaryVO> WorkerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO workerSalaryPO : WorkerSalaryPOs){
			
			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO(new DecorationVO(),new UserBaseVO(new DutyVO()),new UserBaseVO(),new UserBaseVO());

			if(workerSalaryPO.getDecoration() != null){
				
				workerSalaryVO.setDecoration(new DecorationVO());
				workerSalaryPO.getDecoration().ptvcascade(workerSalaryVO.getDecoration());
				if(workerSalaryPO.getDecoration().getSupervisor() != null){
					
					UserBaseVO supervisorVO = new UserBaseVO();
					supervisorVO.setUserName(workerSalaryPO.getDecoration().getSupervisor().getUserName());
					workerSalaryVO.getDecoration().setSupervisor(supervisorVO);
				}
				
			}
			BeanUtil.copyProperties(workerSalaryPO.getApprover(), workerSalaryVO.getApprover(),Arrays.asList("dept", "role","duty"));
			BeanUtil.copyProperties(workerSalaryPO.getCreater(), workerSalaryVO.getCreater(),Arrays.asList("dept", "role","duty"));
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO, Arrays.asList("decoration","user","creater","approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(), workerSalaryVO.getUser(),Arrays.asList("dept", "role","duty"));
			BeanUtil.copyProperties(workerSalaryPO.getUser().getDuty(), workerSalaryVO.getUser().getDuty(),Arrays.asList("departmentType"));
		
			WorkerSalaryVOs.add(workerSalaryVO);
		}
		paging.setData(WorkerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalaryVO) {

		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalary(workerSalaryVO.getUser().getUserId(),constructionScheduleDao.get(workerSalaryVO.getCsid()).getCid());
		List<WorkerSalaryVO> workerSalarys = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {
			
			WorkerSalaryVO workerSalaryvo = new WorkerSalaryVO(new DecorationVO(),new UserBaseVO(),new UserBaseVO(),new UserBaseVO() );
			
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryvo,Arrays.asList("user","decoration","creater","approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(),workerSalaryvo.getUser(), Arrays.asList("dept", "role","duty"));
			workerSalarys.add(workerSalaryvo);
		}
		return workerSalarys;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorkerSalary(WorkerSalaryVO workerSalaryVO,String userId, int company) throws FLException {
		
		UserPO user = userdao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
	
		UserPO	userpo = userdao.queryUserByUserId(userId);
		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(user,userpo);

		if(workerSalaryVO.getCsid() != 0){
			
			ConstructionSchedulePO  constructionSchedulePO = constructionScheduleDao.get(workerSalaryVO.getCsid());
			
			if(constructionSchedulePO.getStatus() != WorkerSalaryPO.COLUMN_CONSTRUCTION_STATUS){
				throw new FLException( 280003, "施工环节未完工");
			}
			
			long cid = constructionSchedulePO.getCid();
			ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);
			
		    if(constructionPO == null){
			      throw new FLException(120020, "工程信息不存在");
			}
		    workerSalaryPO.setDecoration(new DecorationPO());
		    workerSalaryPO.getDecoration().setOrderId(constructionPO.getDecoration().getOrderId());
		    workerSalaryPO.setCid(cid);
		}else{
		    workerSalaryPO.setCid(WorkerSalaryPO.CSID_INIT_STR);
		}
		workerSalaryPO.setCompany(company);
		workerSalaryPO.setSubtype(workerSalaryVO.getSubtype());
		workerSalaryPO.setComment(workerSalaryVO.getComment());
	    workerSalaryPO.setType(workerSalaryVO.getType());
	    workerSalaryPO.setSalary(workerSalaryVO.getSalary());
	    workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
	    workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
	    workerSalaryDao.save(workerSalaryPO);
	   	    	    
	    workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
	    workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setSubtype(workerSalaryPO.getSubtype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());
		
		if (workerSalaryPO == null) { 
			throw new FLException(280001, "薪资信息不存在");
		}
		if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		
		BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
		BeanUtil.copyProperties(workerSalaryVO.getUser(),workerSalaryPO.getUser(), Arrays.asList("dept", "role","duty"));
		workerSalaryDao.update(workerSalaryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int adoptWorkerSalary(List<WorkerSalaryVO> workerSalarys,String userId)  throws FLException{
			
		UserPO approval = userdao.queryUserByUserId(userId);

		for (WorkerSalaryVO workerSalaryVO : workerSalarys) {
		
			WorkerSalaryPO	workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());
			
			if(workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_STR){
				throw new FLException(280002, "工费状态不可操作");
			}
		
			workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STRONE);
			workerSalaryPO.setApprover(approval);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int rejectWorkerSalary(List<WorkerSalaryVO> workerSalarys,String userId)  throws FLException{
			
		UserPO approval = userdao.queryUserByUserId(userId);
		
		for (WorkerSalaryVO workerSalaryVO : workerSalarys) {
		
			WorkerSalaryPO	workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());
		
			if(workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_STR){
				throw new FLException(280002, "工费状态不可操作");
			}
			
			workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STRTWO);
			workerSalaryPO.setApprover(approval);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO worksalarypo = workerSalaryDao.get(workerSalaryVO.getWsId());
		
		if (worksalarypo == null) {
			throw new FLException(280001, "薪资信息不存在");
		}
		if (worksalarypo.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		
		workerSalaryDao.delete(worksalarypo);
	}

}

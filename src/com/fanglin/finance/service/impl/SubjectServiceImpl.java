/**
 * @File Name		: SubjectServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.dao.SubjectDao;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.finance.service.SubjectBalanceService;
import com.fanglin.finance.service.SubjectService;
import com.fanglin.finance.vo.SubjectVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("subjectService")
@Transactional(readOnly=true)
public class SubjectServiceImpl implements SubjectService {
	
	@Autowired
	private SubjectDao subjectDao;
	
	@Autowired
	private AccountDao accountDao;
	
	@Autowired
	private SubjectBalanceService subjectBalanceService;

	@Override
	public void pageSubject(Paging paging, List<Filter> filters) {
		
		List<SubjectPO> subjectPOs = subjectDao.pageSubject(paging, filters);
		List<SubjectVO> subjectVOs = new ArrayList<SubjectVO>();
		
		for(SubjectPO subjectPO: subjectPOs){
			SubjectVO subjectVO = new SubjectVO();
			
			BeanUtil.copyProperties(subjectPO, subjectVO);
			
			subjectVOs.add(subjectVO);
		}
		
		paging.setData(subjectVOs);
	}

	@Override
	public List<SubjectVO> querySubject() {
		
		List<SubjectPO> subjectPOs = subjectDao.querySubject();
		List<SubjectVO> subjectVOs = new ArrayList<SubjectVO>();
		
		for(SubjectPO subjectPO: subjectPOs){
			SubjectVO subjectVO = new SubjectVO();
			BeanUtil.copyProperties(subjectPO, subjectVO);
			
			subjectVOs.add(subjectVO);
		}
		
		return subjectVOs;
	}

	@Override
	public List<SubjectVO> querySubjectByNameOCode(SubjectVO subjectVO) {
		
		List<SubjectPO> subjectPOs = subjectDao.querySubjectByNameOCode(subjectVO.getName(), subjectVO.getName());
		List<SubjectVO> subjectVOs = new ArrayList<SubjectVO>();
		
		for(SubjectPO subjectPO: subjectPOs){
			subjectVO = new SubjectVO();
			BeanUtil.copyProperties(subjectPO, subjectVO);
			
			subjectVOs.add(subjectVO);
		}
		
		return subjectVOs;
	}

	@Override
	public SubjectVO querySubjectByCode(SubjectVO subjectVO) throws FLException {
		
		if(subjectVO.getCode().length() != SubjectPO.CODE_LENGTH_INT){
			throw new FLException(1010003, "科目编号长度错误");
		}
		
		SubjectPO subjectPO = subjectDao.querySubjectByCode(subjectVO.getCode());
		
		if(subjectPO != null){
			BeanUtil.copyProperties(subjectPO, subjectVO);
		}
		
		return subjectVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSubject(SubjectVO subjectVO) throws FLException {
		
		String fatherCode = null;
		
		SubjectPO subjectPO = subjectDao.querySubjectByCode(subjectVO.getCode());
		
		if(subjectPO != null){
			throw new FLException(1010001, "科目编号已经存在");
		}
		
		subjectPO = new SubjectPO();
		
		BeanUtil.copyProperties(subjectVO, subjectPO);
		
		short level = subjectVO.getLevel();
		
		if(level == 2 || level == 3){
			if(level == 2){
				fatherCode = String.format("%s%s%s", subjectVO.getOneCode(), "000", "000");
			}else if(level == 3){
				fatherCode = String.format("%s%s%s", subjectVO.getOneCode(), subjectVO.getTwoCode(), "000");
			}
			
			SubjectPO fatherSubjectPO = subjectDao.querySubjectByCode(fatherCode);
			
			if(fatherSubjectPO == null){
				throw new FLException(1010004, "上级科目不存在");
			}
			
			fatherSubjectPO.setLimits(SubjectPO.LIMITS_ENABLE_INT);
			
			subjectDao.update(fatherSubjectPO);
		}
		
		subjectDao.save(subjectPO);
		
		subjectVO.setSid(subjectPO.getSid());
		subjectVO.setStatus(subjectPO.getStatus());
		
		subjectBalanceService.addSubjectBalanceForSubject(subjectVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSubject(SubjectVO subjectVO) throws FLException {
		
		SubjectPO subjectPO = subjectDao.get(subjectVO.getSid());
		
		if(subjectPO == null){
			throw new FLException(1010000, "科目不存在");
		}
		
		int count = accountDao.countAccountByCode(subjectPO.getOneCode(), subjectPO.getTwoCode(), subjectPO.getThrCode());
		
		if(count != 0){
			throw new FLException(1010002, "科目已被引用");
		}
		
		subjectPO.setAssistant(subjectVO.getAssistant());
		subjectPO.setDirection(subjectVO.getDirection());
		
		subjectDao.update(subjectPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSubjectForStatus(SubjectVO subjectVO) throws FLException {

		SubjectPO subjectPO = subjectDao.get(subjectVO.getSid());
		
		if(subjectPO == null){
			throw new FLException(1010000, "科目不存在");
		}
		
		if(subjectPO.getStatus() == SubjectPO.STATUS_ENABLE_INT){
			subjectPO.setStatus(SubjectPO.STATUS_DISABLE_INT);
		}else if(subjectPO.getStatus() == SubjectPO.STATUS_DISABLE_INT){
			subjectPO.setStatus(SubjectPO.STATUS_ENABLE_INT);
		}
		
		subjectDao.update(subjectPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteSubject(SubjectVO subjectVO) throws FLException {
		
		SubjectPO subjectPO = subjectDao.get(subjectVO.getSid());
		
		if(subjectPO == null){
			throw new FLException(1010000, "科目不存在");
		}
		
		int count = accountDao.countAccountByCode(subjectPO.getOneCode(), subjectPO.getTwoCode(), subjectPO.getThrCode());
		
		if(count != 0){
			throw new FLException(1010002, "科目已被引用");
		}
		
		subjectBalanceService.deleteSubjectBalanceBySId(subjectPO.getSid());
		
		subjectDao.delete(subjectPO);
		
		return 0;
	}

}

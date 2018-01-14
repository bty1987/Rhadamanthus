/**
 * @File Name		: SubjectBalanceServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.dao.PeriodDao;
import com.fanglin.finance.dao.SubjectBalanceDao;
import com.fanglin.finance.dao.SubjectDao;
import com.fanglin.finance.po.PeriodPO;
import com.fanglin.finance.po.SubjectBalancePO;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.finance.service.SubjectBalanceService;
import com.fanglin.finance.vo.SubjectBalanceVO;
import com.fanglin.finance.vo.SubjectVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("subjectBalanceService")
@Transactional(readOnly=true)
public class SubjectBalanceServiceImpl implements SubjectBalanceService {
	
	@Autowired
	private PeriodDao periodDao;
	
	@Autowired
	private SubjectDao subjectDao;
	
	@Autowired
	private SubjectBalanceDao subjectBalanceDao;
	
	@Autowired
	private AccountDao accountDao;

	@Override
	public void pageSubjectBalance(Paging paging, List<Filter> filters) {
		
		List<SubjectBalancePO> subjectBalancePOs = subjectBalanceDao.pageSubjectBalance(paging, filters);
		List<SubjectBalanceVO> subjectBalanceVOs = new ArrayList<SubjectBalanceVO>();
		
		for(SubjectBalancePO subjectBalancePO: subjectBalancePOs){
			SubjectBalanceVO subjectBalanceVO = new SubjectBalanceVO();
			
			BeanUtil.copyProperties(subjectBalancePO, subjectBalanceVO, Arrays.asList("subject"));
			
			SubjectVO subjectVO = new SubjectVO();
			BeanUtil.copyProperties(subjectBalancePO.getSubject(), subjectVO);
			subjectBalanceVO.setSubject(subjectVO);
			
			subjectBalanceVOs.add(subjectBalanceVO);
		}
		
		paging.setData(subjectBalanceVOs);
	}

	@Override
	public List<SubjectBalanceVO> querySubjectBalance(List<Filter> filters) {
		
		List<SubjectBalancePO> subjectBalancePOs = subjectBalanceDao.querySubjectBalance(filters);
		List<SubjectBalanceVO> subjectBalanceVOs = new ArrayList<SubjectBalanceVO>();
		
		for(SubjectBalancePO subjectBalancePO: subjectBalancePOs){
			SubjectBalanceVO subjectBalanceVO = new SubjectBalanceVO();
			
			BeanUtil.copyProperties(subjectBalancePO, subjectBalanceVO, Arrays.asList("subject"));
			
			SubjectVO subjectVO = new SubjectVO();
			BeanUtil.copyProperties(subjectBalancePO.getSubject(), subjectVO);
			subjectBalanceVO.setSubject(subjectVO);
			
			subjectBalanceVOs.add(subjectBalanceVO);
		}
		
		return subjectBalanceVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSubjectBalanceForSubject(SubjectVO subjectVO) {
		
		List<PeriodPO> periodPOs = periodDao.queryPeriod();
		
		SubjectPO subjectPO = new SubjectPO(subjectVO.getSid());
		
		for(PeriodPO periodPO: periodPOs){
			SubjectBalancePO subjectBalancePO = new SubjectBalancePO();
			
			subjectBalancePO.setSubject(subjectPO);
			subjectBalancePO.setPeriod(periodPO.getPeriod());
			
			subjectBalancePO.setTotal(0);
			subjectBalancePO.setInitial(0);
			subjectBalancePO.setBalance(0);
			subjectBalancePO.setDebit(0);
			subjectBalancePO.setCredit(0);
			subjectBalancePO.setAnnual(0);
			subjectBalancePO.setAdebit(0);
			subjectBalancePO.setAcredit(0);
			
			if(periodPOs.indexOf(periodPO) == periodPOs.size() - 1){
				subjectBalancePO.setStatus(SubjectBalancePO.STATUS_INIT_INT);
			}else{
				subjectBalancePO.setStatus(SubjectBalancePO.STATUS_EXPIRED_INT);
			}
			
			subjectBalanceDao.save(subjectBalancePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSubjectBalanceForBalance(SubjectBalanceVO subjectBalanceVO) throws FLException {
		
		SubjectPO subjectPO = subjectDao.get(subjectBalanceVO.getSubject().getSid());
		
		if(subjectPO == null){
			throw new FLException(1010000, "科目不存在");
		}
		
		int count = accountDao.countAccountByCode(subjectPO.getOneCode(), subjectPO.getTwoCode(), subjectPO.getThrCode());
		
		if(count > 0){
			throw new FLException(1010002, "科目已被引用");
		}
		
		List<SubjectBalancePO> subjectBalancePOs = subjectBalanceDao.querySubjectBalanceBySubjectCode(subjectPO.getCode());
		
		for(SubjectBalancePO subjectBalancePO: subjectBalancePOs){
			
			float balance = subjectBalanceVO.getBalance();
			
			subjectBalancePO.setTotal(balance);
			subjectBalancePO.setInitial(balance);
			subjectBalancePO.setBalance(balance);
			subjectBalancePO.setAnnual(balance);
			
			subjectBalanceDao.update(subjectBalancePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int alowSubjectBalanceForBalanceByCodeAPeriod(String code, String period, float debit, float credit){
		
		List<SubjectBalancePO> subjectBalancePOs = subjectBalanceDao.querySubjectBalanceBySubjectCodeGePeriod(code, period);
		
		float tmptotal = Arith.sub(debit, credit);
		
		for(SubjectBalancePO subjectBalancePO: subjectBalancePOs){
			
			if(!period.equals(subjectBalancePO.getPeriod())){
				subjectBalancePO.setInitial(Arith.add(subjectBalancePO.getInitial(), tmptotal));
			}
			
			subjectBalancePO.setTotal(Arith.add(subjectBalancePO.getTotal(), tmptotal));
			subjectBalancePO.setBalance(Arith.add(subjectBalancePO.getBalance(), tmptotal));
			subjectBalancePO.setDebit(Arith.add(subjectBalancePO.getDebit(), debit));
			subjectBalancePO.setCredit(Arith.add(subjectBalancePO.getCredit(), credit));
			subjectBalancePO.setAnnual(Arith.add(subjectBalancePO.getAnnual(), tmptotal));
			subjectBalancePO.setAdebit(Arith.add(subjectBalancePO.getAdebit(), debit));
			subjectBalancePO.setAcredit(Arith.add(subjectBalancePO.getAcredit(), credit));
			
			subjectBalanceDao.update(subjectBalancePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteSubjectBalanceBySId(long sId) {
		
		subjectBalanceDao.deleteSubjectBalanceBySId(sId);
		
		return 0;
	}

}

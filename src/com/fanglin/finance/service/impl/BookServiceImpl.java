/**
 * @File Name		: BookServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.dao.PeriodDao;
import com.fanglin.finance.dao.SubjectBalanceDao;
import com.fanglin.finance.dao.VoucherDao;
import com.fanglin.finance.po.AccountPO;
import com.fanglin.finance.po.PeriodPO;
import com.fanglin.finance.po.SubjectBalancePO;
import com.fanglin.finance.po.VoucherPO;
import com.fanglin.finance.service.BookService;

@Service("bookService")
@Transactional(readOnly=true)
public class BookServiceImpl implements BookService {
	
	@Autowired
	private PeriodDao periodDao;
	
	@Autowired
	private SubjectBalanceDao subjectBalanceDao;
	
	@Autowired
	private VoucherDao voucherDao;
	
	@Autowired
	private AccountDao accountDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int initBook(String period) throws FLException {
		
		List<SubjectBalancePO> subjectBalancePOs = subjectBalanceDao.querySubjectBalanceForInit();
		
		for(SubjectBalancePO subjectBalancePO: subjectBalancePOs){
			SubjectBalancePO _subjectBalancePO = new SubjectBalancePO();
			
			_subjectBalancePO.setPeriod(period);
			_subjectBalancePO.setSubject(subjectBalancePO.getSubject());
			
			_subjectBalancePO.setTotal(subjectBalancePO.getTotal());
			_subjectBalancePO.setInitial(subjectBalancePO.getBalance());
			_subjectBalancePO.setBalance(subjectBalancePO.getBalance());
			
			_subjectBalancePO.setDebit(0);
			_subjectBalancePO.setCredit(0);
			
			if("01".equals(period.substring(period.length() - 2))){
				_subjectBalancePO.setAnnual(subjectBalancePO.getBalance());
				_subjectBalancePO.setAcredit(0);
				_subjectBalancePO.setAdebit(0);
			}else{
				_subjectBalancePO.setAnnual(subjectBalancePO.getAnnual());
				_subjectBalancePO.setAcredit(subjectBalancePO.getAcredit());
				_subjectBalancePO.setAdebit(subjectBalancePO.getAdebit());
			}
			
			_subjectBalancePO.setStatus(SubjectBalancePO.STATUS_INIT_INT);
			subjectBalanceDao.save(_subjectBalancePO);
			
			subjectBalancePO.setStatus(SubjectBalancePO.STATUS_EXPIRED_INT);
			subjectBalanceDao.update(subjectBalancePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int checkoutBook() throws FLException {
		
		PeriodPO periodPO = periodDao.queryPeriodForCurrent();
		
		String currentPeriod = periodPO.getPeriod();
		String nextPeriod = PeriodPO.nextPeriod(currentPeriod);
		
		PeriodPO nextPeriodPO = new PeriodPO(nextPeriod, PeriodPO.STATUS_INIT_INT);
		
		periodDao.save(nextPeriodPO);
		
		initBook(nextPeriod);
		
		voucherDao.alowVoucherForPeriodByPrecut(currentPeriod, nextPeriod);
		accountDao.alowAccountForPeriodByPrecut(currentPeriod, nextPeriod);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int openBook(String period) throws FLException {
		
		PeriodPO periodPO = periodDao.queryPeriodByPeriod(period);
		
		if(periodPO == null){
			throw new FLException(1010201, "期间信息不存在");
		}
		
		PeriodPO nextPeriodPO = periodDao.queryPeriodByPeriod(PeriodPO.nextPeriod(period));
		
		if(nextPeriodPO == null){
			throw new FLException(1010202, "后一期间信息不存在");
		}
		
		if(periodPO.getStatus() == PeriodPO.STATUS_INIT_INT){
			throw new FLException(1010207, "操作期间处于开帐状态");
		}
		
		if(nextPeriodPO.getStatus() == PeriodPO.STATUS_CLOSED_INT){
			throw new FLException(1010203, "后一期间处于关帐状态");
		}
		
		voucherDao.updateVoucherForStatusByPeriod(period, VoucherPO.STATUS_TYPE_FORMAL_INT);
		accountDao.updateAccountForStatusByPeriod(period, AccountPO.STATUS_TYPE_FORMAL_INT);
		
		periodPO.setStatus(PeriodPO.STATUS_INIT_INT);
		
		periodDao.update(periodPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int closeBook(String period) throws FLException {
		
		PeriodPO periodPO = periodDao.queryPeriodByPeriod(period);
		
		if(periodPO == null){
			throw new FLException(1010201, "期间信息不存在");
		}
		
		PeriodPO currentPeriodPO = periodDao.queryPeriodForCurrent();
		
		if(periodPO.getStatus() == PeriodPO.STATUS_CLOSED_INT){
			throw new FLException(1010208, "操作期间处于关帐状态");
		}
		
		if(currentPeriodPO.getPeriod().equals(periodPO.getPeriod())){
			throw new FLException(1010206, "当前期间不能关帐");
		}
		
		PeriodPO previousPeriodPO = periodDao.queryPeriodByPeriod(PeriodPO.previousPeriod(period));
		
		if(previousPeriodPO != null && previousPeriodPO.getStatus() == PeriodPO.STATUS_INIT_INT){
			throw new FLException(1010205, "前一期间处于关帐状态");
		}
		
		voucherDao.updateVoucherForStatusByPeriod(period, VoucherPO.STATUS_TYPE_CLOSED_INT);
		accountDao.updateAccountForStatusByPeriod(period, AccountPO.STATUS_TYPE_CLOSED_INT);
		
		periodPO.setStatus(PeriodPO.STATUS_CLOSED_INT);
		
		return 0;
	}

}

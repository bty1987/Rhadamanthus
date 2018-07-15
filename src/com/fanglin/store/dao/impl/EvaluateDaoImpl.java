package com.fanglin.store.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.EvaluateDao;
import com.fanglin.store.po.EvaluatePO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.utils.Paging;

@Repository("evaluateDao")
public class EvaluateDaoImpl extends DaoImpl<EvaluatePO> implements EvaluateDao{

	public EvaluateDaoImpl(){
		super(EvaluatePO.class);
	}

	@Override
	public List<EvaluatePO> pageEvaluate(Paging paging, List<Filter> filters, List <Long> pids) {
		
		PagingQuery<EvaluatePO> query = pagingQuery(paging, EvaluatePO.class);
		
		if(filters != null){
			
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(EvaluatePO.COLUMN_SCORE_STR)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if(field.equals("unionId")){
					query.add(query.getCriterion("unionId", data, op));
				}else if(field.equals(MgoodsPO.COLUMN_GID_STR)){
					query.alias("mprice", "mprice");
					query.add(query.getCriterion(EvaluatePO.COLUMN_PID_STR, pids, "in"));	
				}
			}
		}
		return query.desc("createTime").list();
	}
	
}


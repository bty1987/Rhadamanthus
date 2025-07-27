package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.construction.dao.ConstructionDiaryDrawingDao;
import com.fanglin.construction.po.ConstructionDiaryDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionDiaryDrawingDao")
public class ConstructionDiaryDrawingDaoImpl extends DaoImpl<ConstructionDiaryDrawingPO> implements ConstructionDiaryDrawingDao {

	private ConstructionDiaryDrawingDaoImpl(){
		super(ConstructionDiaryDrawingPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionDiaryDrawingPO> queryConstructionDiaryDrawingByCdid(Long cdid) {
		
		Criteria constructionlist = session().createCriteria(ConstructionDiaryDrawingPO.class).add(Restrictions.eq(ConstructionDiaryDrawingPO.COLUMN_CDID_STR, cdid));
		
		return constructionlist.list();
	}
	
	@Override
	public int countConstructionDiaryDrawing(Long cdid) {

		String sql = "select count(*) from construction.constructionDiaryDrawing where cdid = :cdid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong(ConstructionDiaryDrawingPO.COLUMN_CDID_STR, cdid).uniqueResult();

		return count.intValue();
	}

}

package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "measurementunit", catalog = "communion")
public class MeasurementUnitPO implements Serializable {

	private static final long serialVersionUID = -8051808038287996405L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_ID_STR = "id";

	private int id;

	private String name;

	private String unitDes;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "unitDes")
	public String getUnitDes() {
		return unitDes;
	}

	public void setUnitDes(String unitDes) {
		this.unitDes = unitDes;
	}

	public MeasurementUnitPO(int id) {
		this.id = id;
	}

	public MeasurementUnitPO() {
		super();
	}

}

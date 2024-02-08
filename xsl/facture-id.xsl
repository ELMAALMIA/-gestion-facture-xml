<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8"/>

  <!-- Define a parameter to accept the facture ID -->
  <xsl:param name="factureId" />

  <xsl:template match="/">
    <html>
      <head>
        <title>Facture</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <!-- Apply the template only to the specified facture -->
        <xsl:apply-templates select="factures/facture[@id = $factureId]"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="facture">
    <div>
      <h3>Facture ID: <xsl:value-of select="@id"/></h3>
      <p>Date: <xsl:value-of select="date"/></p>
      <table>
        <tr>
          <th>Description</th>
          <th>Quantité</th>
          <th>Prix Unitaire</th>
        </tr>
        <xsl:apply-templates select="articles/article"/>
      </table>
      <p>Total: <xsl:value-of select="total"/></p>
    </div>
  </xsl:template>

  <xsl:template match="articles/article">
    <tr>
      <td><xsl:value-of select="description"/></td>
      <td><xsl:value-of select="quantite"/></td>
      <td><xsl:value-of select="prixUnitaire"/></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
